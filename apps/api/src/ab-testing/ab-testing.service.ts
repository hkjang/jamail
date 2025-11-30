import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ABTestingService {
    constructor(private prisma: PrismaService) { }

    async createVariant(templateId: string, variantData: any) {
        // Get the template to determine next version number
        const template = await this.prisma.template.findUnique({
            where: { id: templateId },
            include: { versions: true },
        });

        if (!template) {
            throw new Error('Template not found');
        }

        const nextVersionNumber = template.versions.length + 1;
        const variantGroup = variantData.variantGroup || `abtest_${Date.now()}`;

        const variant = await this.prisma.templateVersion.create({
            data: {
                templateId,
                versionNumber: nextVersionNumber,
                subject: variantData.subject,
                htmlContent: variantData.htmlContent,
                textContent: variantData.textContent || '',
                isVariant: true,
                variantName: variantData.variantName,
                variantGroup,
                trafficSplit: variantData.trafficSplit || 50,
            },
        });

        // Initialize A/B test results
        await this.prisma.aBTestResult.create({
            data: {
                templateId,
                versionId: variant.id,
                variantName: variantData.variantName,
            },
        });

        return variant;
    }

    async getVariants(templateId: string) {
        return this.prisma.templateVersion.findMany({
            where: {
                templateId,
                isVariant: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateTrafficSplit(versionId: string, trafficSplit: number) {
        return this.prisma.templateVersion.update({
            where: { id: versionId },
            data: { trafficSplit },
        });
    }

    async selectVariantForSending(templateId: string): Promise<any> {
        // Get all active variants for this template
        const variants = await this.prisma.templateVersion.findMany({
            where: {
                templateId,
                isVariant: true,
            },
        });

        if (variants.length === 0) {
            // No variants, use current version
            const template = await this.prisma.template.findUnique({
                where: { id: templateId },
                include: { versions: true },
            });

            if (!template || template.versions.length === 0) {
                throw new Error('Template not found or has no versions');
            }

            return template.versions[0];
        }

        // Weighted random selection based on traffic split
        const totalWeight = variants.reduce((sum, v) => sum + (v.trafficSplit || 0), 0);
        let random = Math.random() * totalWeight;

        for (const variant of variants) {
            random -= variant.trafficSplit || 0;
            if (random <= 0) {
                return variant;
            }
        }

        return variants[0];
    }

    async recordEvent(versionId: string, event: 'sent' | 'open' | 'click' | 'conversion') {
        const result = await this.prisma.aBTestResult.findFirst({
            where: { versionId },
        });

        if (!result) {
            throw new Error('A/B test result not found');
        }

        const updates: any = {};

        switch (event) {
            case 'sent':
                updates.totalSent = { increment: 1 };
                break;
            case 'open':
                updates.opens = { increment: 1 };
                break;
            case 'click':
                updates.clicks = { increment: 1 };
                break;
            case 'conversion':
                updates.conversions = { increment: 1 };
                break;
        }

        const updated = await this.prisma.aBTestResult.update({
            where: { id: result.id },
            data: updates,
        });

        // Recalculate rates
        if (updated.totalSent > 0) {
            await this.prisma.aBTestResult.update({
                where: { id: result.id },
                data: {
                    openRate: (updated.opens / updated.totalSent) * 100,
                    clickRate: (updated.clicks / updated.totalSent) * 100,
                    conversionRate: (updated.conversions / updated.totalSent) * 100,
                },
            });
        }

        return updated;
    }

    async getABTestResults(templateId: string) {
        return this.prisma.aBTestResult.findMany({
            where: { templateId },
            include: {
                version: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async declareWinner(templateId: string, winnerVersionId: string) {
        // Set the winning variant as the current version
        await this.prisma.template.update({
            where: { id: templateId },
            data: { currentVersionId: winnerVersionId },
        });

        // Optionally, disable other variants
        await this.prisma.templateVersion.updateMany({
            where: {
                templateId,
                isVariant: true,
                NOT: { id: winnerVersionId },
            },
            data: { trafficSplit: 0 },
        });

        return { message: 'Winner declared successfully' };
    }
}
