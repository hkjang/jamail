import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { HtmlRenderService } from './html-render.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, QueueModule, AuthModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, HtmlRenderService],
  exports: [TemplatesService],
})
export class TemplatesModule { }
