import { PrismaService } from '../prisma/prisma.service';
export declare class ABTestingService {
    private prisma;
    constructor(prisma: PrismaService);
    createVariant(templateId: string, variantData: any): Promise<{
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
    getVariants(templateId: string): Promise<{
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
    updateTrafficSplit(versionId: string, trafficSplit: number): Promise<{
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
    selectVariantForSending(templateId: string): Promise<any>;
    recordEvent(versionId: string, event: 'sent' | 'open' | 'click' | 'conversion'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        variantName: string;
        totalSent: number;
        opens: number;
        clicks: number;
        conversions: number;
        openRate: number;
        clickRate: number;
        conversionRate: number;
        versionId: string;
    }>;
    getABTestResults(templateId: string): Promise<({
        version: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        variantName: string;
        totalSent: number;
        opens: number;
        clicks: number;
        conversions: number;
        openRate: number;
        clickRate: number;
        conversionRate: number;
        versionId: string;
    })[]>;
    declareWinner(templateId: string, winnerVersionId: string): Promise<{
        message: string;
    }>;
}
