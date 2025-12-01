import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateTemplateVersionDto } from './dto/version.dto';
import { PreviewTemplateDto } from './dto/preview.dto';
import { SendEmailDto } from './dto/send.dto';
import { Queue } from 'bullmq';
export declare class TemplatesController {
    private readonly templatesService;
    private emailQueue;
    constructor(templatesService: TemplatesService, emailQueue: Queue);
    create(createTemplateDto: CreateTemplateDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        currentVersionId: string | null;
        defaultLanguage: string;
    }>;
    findAll(): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string;
            htmlContent: string;
            textContent: string | null;
            variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
            versionNumber: number;
            templateId: string;
            isVariant: boolean;
            variantName: string | null;
            variantGroup: string | null;
            trafficSplit: number | null;
            createdBy: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        currentVersionId: string | null;
        defaultLanguage: string;
    })[]>;
    preview(previewDto: PreviewTemplateDto): Promise<{
        html: string;
    }>;
    getStats(): Promise<{
        totalTemplates: number;
        totalSent: number;
        totalFailed: number;
        recentLogs: {
            id: string;
            createdAt: Date;
            subject: string | null;
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
    findOne(id: string): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string;
            htmlContent: string;
            textContent: string | null;
            variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
            versionNumber: number;
            templateId: string;
            isVariant: boolean;
            variantName: string | null;
            variantGroup: string | null;
            trafficSplit: number | null;
            createdBy: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        currentVersionId: string | null;
        defaultLanguage: string;
    }) | null>;
    update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        currentVersionId: string | null;
        defaultLanguage: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        category: import(".prisma/client").$Enums.TemplateCategory;
        currentVersionId: string | null;
        defaultLanguage: string;
    }>;
    createVersion(id: string, createVersionDto: CreateTemplateVersionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        variablesSchema: import("@prisma/client/runtime/library").JsonValue | null;
        versionNumber: number;
        templateId: string;
        isVariant: boolean;
        variantName: string | null;
        variantGroup: string | null;
        trafficSplit: number | null;
        createdBy: string | null;
    }>;
    send(id: string, sendDto: SendEmailDto): Promise<{
        logId: string;
        status: string;
    }>;
}
