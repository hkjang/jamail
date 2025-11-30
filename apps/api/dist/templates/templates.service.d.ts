import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateTemplateVersionDto } from './dto/version.dto';
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTemplateDto: CreateTemplateDto): Promise<{
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        id: string;
        currentVersionId: string | null;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        versions: {
            subject: string;
            htmlContent: string;
            textContent: string | null;
            variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            versionNumber: number;
            templateId: string;
            isVariant: boolean;
            variantName: string | null;
            variantGroup: string | null;
            trafficSplit: number | null;
            createdBy: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        id: string;
        currentVersionId: string | null;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
        versions: {
            subject: string;
            htmlContent: string;
            textContent: string | null;
            variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            versionNumber: number;
            templateId: string;
            isVariant: boolean;
            variantName: string | null;
            variantGroup: string | null;
            trafficSplit: number | null;
            createdBy: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        id: string;
        currentVersionId: string | null;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<{
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        id: string;
        currentVersionId: string | null;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        id: string;
        currentVersionId: string | null;
        defaultLanguage: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createVersion(templateId: string, createVersionDto: CreateTemplateVersionDto): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        versionNumber: number;
        templateId: string;
        isVariant: boolean;
        variantName: string | null;
        variantGroup: string | null;
        trafficSplit: number | null;
        createdBy: string | null;
    }>;
    preview(htmlContent: string, variables?: Record<string, any>): Promise<string>;
    validateVariables(schema: any, variables: any): Promise<boolean>;
    getVersions(templateId: string): Promise<{
        subject: string;
        htmlContent: string;
        textContent: string | null;
        variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        versionNumber: number;
        templateId: string;
        isVariant: boolean;
        variantName: string | null;
        variantGroup: string | null;
        trafficSplit: number | null;
        createdBy: string | null;
    }[]>;
    send(templateId: string, recipient: string, variables: Record<string, any> | undefined, queue: any, scheduledAt?: string): Promise<{
        logId: string;
        status: string;
    }>;
    getStats(): Promise<{
        totalTemplates: number;
        totalSent: number;
        totalFailed: number;
        recentLogs: {
            subject: string | null;
            id: string;
            createdAt: Date;
            templateId: string;
            recipient: string;
            status: import(".prisma/client").$Enums.SendStatus;
            sentAt: Date | null;
            smtpResponse: string | null;
            errorReason: string | null;
            retryCount: number;
            scheduledAt: Date | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
}
