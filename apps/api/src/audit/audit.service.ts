import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(action: string, resource: string, resourceId?: string, userId?: string, details?: any) {
        await this.prisma.auditLog.create({
            data: {
                action,
                resource,
                resourceId,
                userId,
                details,
            },
        });
    }
}
