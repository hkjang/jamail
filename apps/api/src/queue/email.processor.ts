import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendStatus } from '@prisma/client';

@Processor('email-sending')
export class EmailProcessor extends WorkerHost {
    constructor(
        private readonly mailService: MailService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { templateId, recipient, subject, html, logId, category } = job.data;

        try {
            const info = await this.mailService.sendEmail(recipient, subject, html, category);

            // Update log to SENT
            await this.prisma.sendLog.update({
                where: { id: logId },
                data: {
                    status: SendStatus.SENT,
                    smtpResponse: JSON.stringify(info),
                },
            });

            return info;
        } catch (error) {
            // Update log to FAILED
            await this.prisma.sendLog.update({
                where: { id: logId },
                data: {
                    status: SendStatus.FAILED,
                    errorReason: error.message,
                },
            });
            throw error;
        }
    }
}
