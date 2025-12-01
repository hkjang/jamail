import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(action: string, resource: string, resourceId?: string, userId?: string, details?: any): Promise<void>;
}
