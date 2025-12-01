import { PrismaService } from '../prisma/prisma.service';
export declare class TranslationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(templateId: string, translationData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    findAll(templateId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }[]>;
    findOne(templateId: string, language: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    } | null>;
    update(templateId: string, language: string, updateData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    remove(templateId: string, language: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    setDefault(templateId: string, language: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    selectTranslation(templateId: string, preferredLanguage?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    } | null>;
}
