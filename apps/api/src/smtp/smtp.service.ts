import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSmtpConfigDto, UpdateSmtpConfigDto } from './dto/smtp-config.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpService {
    private smtpCache: Map<string, any> = new Map();

    constructor(private prisma: PrismaService) { }

    async create(createSmtpDto: CreateSmtpConfigDto) {
        // If this is set as default, unset others
        if (createSmtpDto.isDefault) {
            await this.prisma.smtpConfig.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }

        const config = await this.prisma.smtpConfig.create({
            data: createSmtpDto,
        });

        this.smtpCache.clear(); // Clear cache when config changes
        return config;
    }

    async findAll() {
        return this.prisma.smtpConfig.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.smtpConfig.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateSmtpDto: UpdateSmtpConfigDto) {
        // If this is set as default, unset others
        if (updateSmtpDto.isDefault) {
            await this.prisma.smtpConfig.updateMany({
                where: { isDefault: true, NOT: { id } },
                data: { isDefault: false },
            });
        }

        const config = await this.prisma.smtpConfig.update({
            where: { id },
            data: updateSmtpDto,
        });

        this.smtpCache.clear(); // Clear cache when config changes
        return config;
    }

    async remove(id: string) {
        const config = await this.prisma.smtpConfig.delete({
            where: { id },
        });
        this.smtpCache.clear();
        return config;
    }

    async selectSmtpConfig(category?: string): Promise<any> {
        const cacheKey = category || 'default';

        if (this.smtpCache.has(cacheKey)) {
            return this.smtpCache.get(cacheKey);
        }

        let config;

        // Try to find config for specific category
        if (category) {
            config = await this.prisma.smtpConfig.findFirst({
                where: {
                    categories: {
                        has: category,
                    },
                },
            });
        }

        // Fallback to default config
        if (!config) {
            config = await this.prisma.smtpConfig.findFirst({
                where: { isDefault: true },
            });
        }

        // Fallback to any config
        if (!config) {
            config = await this.prisma.smtpConfig.findFirst();
        }

        if (config) {
            this.smtpCache.set(cacheKey, config);
        }

        return config;
    }

    async testConnection(id: string): Promise<{ success: boolean; message: string }> {
        const config = await this.findOne(id);
        if (!config) {
            return { success: false, message: 'SMTP configuration not found' };
        }

        try {
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: config.username,
                    pass: config.password,
                },
            });

            await transporter.verify();
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}
