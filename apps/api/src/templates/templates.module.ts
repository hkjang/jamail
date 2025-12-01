import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'email-sending',
    }),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule { }
