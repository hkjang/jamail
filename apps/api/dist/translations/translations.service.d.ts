import { PrismaService } from '../prisma/prisma.service';
export declare class TranslationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(templateId: string, translationData: any): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    findAll(templateId: string): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    }[]>;
    findOne(templateId: string, language: string): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    } | null>;
    update(templateId: string, language: string, updateData: any): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    remove(templateId: string, language: string): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    setDefault(templateId: string, language: string): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    selectTranslation(templateId: string, preferredLanguage?: string): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        isDefault: boolean;
        language: string;
    } | null>;
}
