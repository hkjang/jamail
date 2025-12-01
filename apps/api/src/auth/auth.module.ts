import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { ApiKeyGuard } from './api-key.guard';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';

@Module({
    imports: [
        PrismaModule,
        AuditModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [UsersController, ApiKeysController],
    providers: [UsersService, ApiKeysService, JwtStrategy, JwtAuthGuard, RolesGuard, ApiKeyGuard],
    exports: [UsersService, ApiKeysService, JwtAuthGuard, RolesGuard, ApiKeyGuard, JwtModule],
})
export class AuthModule { }
