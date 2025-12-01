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
exports.TranslationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TranslationsService = class TranslationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(templateId, translationData) {
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
    async findAll(templateId) {
        return this.prisma.templateTranslation.findMany({
            where: { templateId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(templateId, language) {
        return this.prisma.templateTranslation.findUnique({
            where: {
                templateId_language: {
                    templateId,
                    language,
                },
            },
        });
    }
    async update(templateId, language, updateData) {
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
    async remove(templateId, language) {
        return this.prisma.templateTranslation.delete({
            where: {
                templateId_language: {
                    templateId,
                    language,
                },
            },
        });
    }
    async setDefault(templateId, language) {
        await this.prisma.templateTranslation.updateMany({
            where: { templateId, isDefault: true },
            data: { isDefault: false },
        });
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
    async selectTranslation(templateId, preferredLanguage) {
        if (preferredLanguage) {
            const translation = await this.findOne(templateId, preferredLanguage);
            if (translation)
                return translation;
        }
        const template = await this.prisma.template.findUnique({
            where: { id: templateId },
        });
        if (template?.defaultLanguage) {
            const translation = await this.findOne(templateId, template.defaultLanguage);
            if (translation)
                return translation;
        }
        const defaultTranslation = await this.prisma.templateTranslation.findFirst({
            where: { templateId, isDefault: true },
        });
        if (defaultTranslation)
            return defaultTranslation;
        const firstTranslation = await this.prisma.templateTranslation.findFirst({
            where: { templateId },
        });
        return firstTranslation;
    }
};
exports.TranslationsService = TranslationsService;
exports.TranslationsService = TranslationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TranslationsService);
//# sourceMappingURL=translations.service.js.map