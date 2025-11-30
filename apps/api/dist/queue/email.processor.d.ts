import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class EmailProcessor extends WorkerHost {
    private readonly mailService;
    private readonly prisma;
    constructor(mailService: MailService, prisma: PrismaService);
    process(job: Job<any, any, string>): Promise<any>;
}
