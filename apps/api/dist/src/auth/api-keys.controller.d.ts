import { ApiKeysService } from './api-keys.service';
import type { CreateApiKeyDto, UpdateApiKeyDto } from './api-keys.service';
import { AuditService } from '../audit/audit.service';
export declare class ApiKeysController {
    private readonly apiKeysService;
    private readonly auditService;
    constructor(apiKeysService: ApiKeysService, auditService: AuditService);
    create(createApiKeyDto: CreateApiKeyDto, req: any): Promise<{
        key: string;
        id: string;
        createdAt: Date;
        name: string;
        scopes: string[];
        expiresAt: Date | null;
        lastUsedAt: Date | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        scopes: string[];
        expiresAt: Date | null;
        lastUsedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        scopes: string[];
        expiresAt: Date | null;
        lastUsedAt: Date | null;
    }>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        scopes: string[];
        expiresAt: Date | null;
        lastUsedAt: Date | null;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
