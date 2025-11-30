import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('webhook-delivery') private webhookQueue: Queue,
    ) { }

    async create(webhookData: any) {
        const secret = this.generateSecret();

        return this.prisma.webhook.create({
            data: {
                ...webhookData,
                secret,
            },
        });
    }

    async findAll() {
        return this.prisma.webhook.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.webhook.findUnique({
            where: { id },
            include: {
                deliveries: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async update(id: string, updateData: any) {
        return this.prisma.webhook.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string) {
        return this.prisma.webhook.delete({
            where: { id },
        });
    }

    async getDeliveries(webhookId: string) {
        return this.prisma.webhookDelivery.findMany({
            where: { webhookId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async trigger(event: string, payload: any) {
        // Find all active webhooks subscribed to this event
        const webhooks = await this.prisma.webhook.findMany({
            where: {
                isActive: true,
                events: {
                    has: event,
                },
            },
        });

        // Create delivery records and queue them
        for (const webhook of webhooks) {
            const delivery = await this.prisma.webhookDelivery.create({
                data: {
                    webhookId: webhook.id,
                    event,
                    payload,
                    status: 'pending',
                },
            });

            // Add to queue for async processing
            await this.webhookQueue.add('deliver-webhook', {
                deliveryId: delivery.id,
                webhookId: webhook.id,
                url: webhook.url,
                secret: webhook.secret,
                event,
                payload,
            });
        }
    }

    async testWebhook(id: string) {
        const webhook = await this.findOne(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        const testPayload = {
            event: 'webhook.test',
            timestamp: new Date().toISOString(),
            data: {
                message: 'This is a test webhook delivery',
            },
        };

        await this.trigger('webhook.test', testPayload);

        return { message: 'Test webhook queued for delivery' };
    }

    generateSignature(payload: string, secret: string): string {
        return crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
    }

    private generateSecret(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}
