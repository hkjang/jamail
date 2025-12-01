"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABTestingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ABTestingService = class ABTestingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createVariant(templateId, variantData) {
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
        await this.prisma.aBTestResult.create({
            data: {
                templateId,
                versionId: variant.id,
                variantName: variantData.variantName,
            },
        });
        return variant;
    }
    async getVariants(templateId) {
        return this.prisma.templateVersion.findMany({
            where: {
                templateId,
                isVariant: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateTrafficSplit(versionId, trafficSplit) {
        return this.prisma.templateVersion.update({
            where: { id: versionId },
            data: { trafficSplit },
        });
    }
    async selectVariantForSending(templateId) {
        const variants = await this.prisma.templateVersion.findMany({
            where: {
                templateId,
                isVariant: true,
            },
        });
        if (variants.length === 0) {
            const template = await this.prisma.template.findUnique({
                where: { id: templateId },
                include: { versions: true },
            });
            if (!template || template.versions.length === 0) {
                throw new Error('Template not found or has no versions');
            }
            return template.versions[0];
        }
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
    async recordEvent(versionId, event) {
        const result = await this.prisma.aBTestResult.findFirst({
            where: { versionId },
        });
        if (!result) {
            throw new Error('A/B test result not found');
        }
        const updates = {};
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
    async getABTestResults(templateId) {
        return this.prisma.aBTestResult.findMany({
            where: { templateId },
            include: {
                version: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async declareWinner(templateId, winnerVersionId) {
        await this.prisma.template.update({
            where: { id: templateId },
            data: { currentVersionId: winnerVersionId },
        });
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
};
exports.ABTestingService = ABTestingService;
exports.ABTestingService = ABTestingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ABTestingService);
//# sourceMappingURL=ab-testing.service.js.map