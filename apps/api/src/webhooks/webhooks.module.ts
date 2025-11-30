import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { WebhookProcessor } from './webhook.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'webhook-delivery',
        }),
    ],
    controllers: [WebhooksController],
    providers: [WebhooksService, WebhookProcessor],
    exports: [WebhooksService],
})
export class WebhooksModule { }
