import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranslationsService {
    constructor(private prisma: PrismaService) { }

    async create(templateId: string, translationData: any) {
        // If this is set as default, unset others
        if (translationData.isDefault) {
            await this.prisma.templateTranslation.updateMany({
                where: { templateId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const translation = await this.prisma.templateTranslation.create({
            data: {
                templateId,
                ...translationData,
            },
        });

        return translation;
    }

    async findAll(templateId: string) {
        return this.prisma.templateTranslation.findMany({
            where: { templateId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(templateId: string, language: string) {
        return this.prisma.templateTranslation.findUnique({
            where: {
                templateId_language: {
                    templateId,
                    language,
                },
            },
        });
    }

    async update(templateId: string, language: string, updateData: any) {
        // If this is set as default, unset others
        if (updateData.isDefault) {
            await this.prisma.templateTranslation.updateMany({
                where: { templateId, isDefault: true, NOT: { language } },
                data: { isDefault: false },
            });
        }

        return this.prisma.templateTranslation.update({
            where: {
                templateId_language: {
                    templateId,
                    language,
                },
            },
            data: updateData,
        });
    }

    async remove(templateId: string, language: string) {
        return this.prisma.templateTranslation.delete({
            where: {
                templateId_language: {
                    templateId,
                    language,
                },
            },
        });
    }

    async setDefault(templateId: string, language: string) {
        // Unset all defaults first
        await this.prisma.templateTranslation.updateMany({
            where: { templateId, isDefault: true },
            data: { isDefault: false },
        });

        // Set the specified language as default
        return this.prisma.templateTranslation.update({
            where: {
                templateId_language: {
                    templateId,
                    language,
                },
            },
            data: { isDefault: true },
        });
    }

    async selectTranslation(templateId: string, preferredLanguage?: string) {
        // Try to get preferred language
        if (preferredLanguage) {
            const translation = await this.findOne(templateId, preferredLanguage);
            if (translation) return translation;
        }

        // Try to get default language from template
        const template = await this.prisma.template.findUnique({
            where: { id: templateId },
        });

        if (template?.defaultLanguage) {
            const translation = await this.findOne(templateId, template.defaultLanguage);
            if (translation) return translation;
        }

        // Try to get default translation
        const defaultTranslation = await this.prisma.templateTranslation.findFirst({
            where: { templateId, isDefault: true },
        });
        if (defaultTranslation) return defaultTranslation;

        // Fallback to first available translation
        const firstTranslation = await this.prisma.templateTranslation.findFirst({
            where: { templateId },
        });

        return firstTranslation;
    }
}
