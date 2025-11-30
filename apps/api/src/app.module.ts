import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplatesModule } from './templates/templates.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { SmtpModule } from './smtp/smtp.module';
import { ABTestingModule } from './ab-testing/ab-testing.module';
import { TranslationsModule } from './translations/translations.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    PrismaModule,
    TemplatesModule,
    MailModule,
    QueueModule,
    AuthModule,
    AuditModule,
    SmtpModule,
    ABTestingModule,
    TranslationsModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
