import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

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

@Injectable()
export class ApiKeysService {
    constructor(private prisma: PrismaService) { }

    private generateKey(): string {
        return 'sk_' + crypto.randomBytes(24).toString('hex');
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }

    async create(createApiKeyDto: CreateApiKeyDto) {
        const key = this.generateKey();
        const keyHash = this.hashKey(key);

        const apiKey = await this.prisma.apiKey.create({
            data: {
                name: createApiKeyDto.name,
                keyHash,
                scopes: createApiKeyDto.scopes,
                expiresAt: createApiKeyDto.expiresAt,
            },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
        });

        // Return the raw key only once
        return { ...apiKey, key };
    }

    async findAll() {
        return this.prisma.apiKey.findMany({
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const apiKey = await this.prisma.apiKey.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
        });

        if (!apiKey) {
            throw new NotFoundException('API Key not found');
        }

        return apiKey;
    }

    async update(id: string, updateApiKeyDto: UpdateApiKeyDto) {
        await this.findOne(id);

        return this.prisma.apiKey.update({
            where: { id },
            data: {
                name: updateApiKeyDto.name,
                scopes: updateApiKeyDto.scopes,
                expiresAt: updateApiKeyDto.expiresAt,
            },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.apiKey.delete({
            where: { id },
        });

        return { message: 'API Key deleted successfully' };
    }

    async validateKey(key: string) {
        const keyHash = this.hashKey(key);

        const apiKey = await this.prisma.apiKey.findUnique({
            where: { keyHash },
        });

        if (!apiKey) {
            return null;
        }

        // Check expiration
        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return null;
        }

        // Update last used
        await this.prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        });

        return apiKey;
    }
}
