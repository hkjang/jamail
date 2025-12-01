import { PrismaService } from '../prisma/prisma.service';
export interface CreateApiKeyDto {
    name: string;
    scopes: string[];
    expiresAt?: Date;
}
export interface UpdateApiKeyDto {
    name?: string;
    scopes?: string[];
    expiresAt?: Date;
}
export declare class ApiKeysService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateKey;
    private hashKey;
    create(createApiKeyDto: CreateApiKeyDto): Promise<{
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
    update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        scopes: string[];
        expiresAt: Date | null;
        lastUsedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    validateKey(key: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        keyHash: string;
        scopes: string[];
        expiresAt: Date | null;
        lastUsedAt: Date | null;
    } | null>;
}
