import { ABTestingService } from './ab-testing.service';
import { CreateVariantDto, UpdateTrafficSplitDto, DeclareWinnerDto } from '../templates/dto/ab-testing.dto';
export declare class ABTestingController {
    private readonly abTestingService;
    constructor(abTestingService: ABTestingService);
    createVariant(templateId: string, createVariantDto: CreateVariantDto): Promise<{
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
    getVariants(templateId: string): Promise<{
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
    }[]>;
    updateTrafficSplit(versionId: string, updateTrafficSplitDto: UpdateTrafficSplitDto): Promise<{
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
    getABTestResults(templateId: string): Promise<({
        version: {
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
    declareWinner(templateId: string, declareWinnerDto: DeclareWinnerDto): Promise<{
        message: string;
    }>;
    trackEvent(versionId: string, event: string): Promise<{
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
}
