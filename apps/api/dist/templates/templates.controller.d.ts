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
    preview(previewDto: PreviewTemplateDto): Promise<{
        html: string;
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
    createVersion(id: string, createVersionDto: CreateTemplateVersionDto): Promise<{
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
    send(id: string, sendDto: SendEmailDto): Promise<{
        logId: string;
        status: string;
    }>;
}
