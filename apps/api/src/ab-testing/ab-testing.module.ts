import { Module } from '@nestjs/common';
import { ABTestingService } from './ab-testing.service';
import { ABTestingController } from './ab-testing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ABTestingController],
    providers: [ABTestingService],
    exports: [ABTestingService],
})
export class ABTestingModule { }
