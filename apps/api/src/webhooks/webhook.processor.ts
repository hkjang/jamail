import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';

@Processor('webhook-delivery')
export class WebhookProcessor extends WorkerHost {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { deliveryId, url, secret, event, payload } = job.data;

        try {
            const timestamp = Date.now();
            const payloadString = JSON.stringify(payload);

            // Generate signature
            const signature = crypto
                .createHmac('sha256', secret)
                .update(payloadString)
                .digest('hex');

            // Send webhook
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Event': event,
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Timestamp': timestamp.toString(),
                },
                timeout: 10000, // 10 second timeout
            });

            // Update delivery status to success
            await this.prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: 'success',
                    responseCode: response.status,
                    responseBody: JSON.stringify(response.data).substring(0, 1000),
                    attempts: { increment: 1 },
                },
            });

            return response.data;
        } catch (error) {
            const attempts = await this.incrementAttempts(deliveryId);

            // Update delivery status
            await this.prisma.webhookDelivery.update({
                where: { id: deliveryId },
                data: {
                    status: attempts >= 3 ? 'failed' : 'pending',
                    responseCode: error.response?.status,
                    responseBody: error.message?.substring(0, 1000),
                    nextRetryAt: attempts < 3 ? this.calculateNextRetry(attempts) : null,
                },
            });

            // Retry if attempts < 3
            if (attempts < 3) {
                throw error; // BullMQ will handle retry
            }
        }
    }

    private async incrementAttempts(deliveryId: string): Promise<number> {
        const delivery = await this.prisma.webhookDelivery.update({
            where: { id: deliveryId },
            data: { attempts: { increment: 1 } },
        });
        return delivery.attempts;
    }

    private calculateNextRetry(attempts: number): Date {
        // Exponential backoff: 1 min, 5 min, 15 min
        const delays = [60000, 300000, 900000];
        const delay = delays[Math.min(attempts, delays.length - 1)];
        return new Date(Date.now() + delay);
    }
}
