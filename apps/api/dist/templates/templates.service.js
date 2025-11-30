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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplatesService = class TemplatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTemplateDto) {
        return this.prisma.template.create({
            data: createTemplateDto,
        });
    }
    async findAll() {
        return this.prisma.template.findMany({
            include: {
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    take: 1,
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.template.findUnique({
            where: { id },
            include: {
                versions: {
                    orderBy: { versionNumber: 'desc' },
                },
            },
        });
    }
    async update(id, updateTemplateDto) {
        return this.prisma.template.update({
            where: { id },
            data: updateTemplateDto,
        });
    }
    async remove(id) {
        return this.prisma.template.delete({
            where: { id },
        });
    }
    async createVersion(templateId, createVersionDto) {
        const lastVersion = await this.prisma.templateVersion.findFirst({
            where: { templateId },
            orderBy: { versionNumber: 'desc' },
        });
        const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;
        const version = await this.prisma.templateVersion.create({
            data: {
                templateId,
                versionNumber: newVersionNumber,
                ...createVersionDto,
            },
        });
        await this.prisma.template.update({
            where: { id: templateId },
            data: { currentVersionId: version.id },
        });
        return version;
    }
    async preview(htmlContent, variables = {}) {
        const Handlebars = (await import('handlebars')).default;
        const template = Handlebars.compile(htmlContent);
        return template(variables);
    }
    async validateVariables(schema, variables) {
        if (!schema)
            return true;
        const Ajv = require('ajv');
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(variables);
        if (!valid)
            throw new Error('Invalid variables: ' + JSON.stringify(validate.errors));
        return true;
    }
    async getVersions(templateId) {
        return this.prisma.templateVersion.findMany({
            where: { templateId },
            orderBy: { versionNumber: 'desc' },
        });
    }
    async send(templateId, recipient, variables = {}, queue, scheduledAt) {
        const template = await this.findOne(templateId);
        if (!template || !template.currentVersionId) {
            throw new Error('Template or version not found');
        }
        const version = template.versions.find(v => v.id === template.currentVersionId);
        if (!version)
            throw new Error('Version not found');
        if (version.variablesSchema) {
            await this.validateVariables(version.variablesSchema, variables);
        }
        const html = await this.preview(version.htmlContent, variables);
        const subject = await this.preview(version.subject, variables);
        const log = await this.prisma.sendLog.create({
            data: {
                templateId,
                recipient,
                subject,
                status: 'PENDING',
                metadata: scheduledAt ? { scheduledAt } : undefined,
            },
        });
        let delay = 0;
        if (scheduledAt) {
            const scheduleTime = new Date(scheduledAt).getTime();
            const now = Date.now();
            delay = Math.max(0, scheduleTime - now);
        }
        await queue.add('email-sending', {
            templateId,
            recipient,
            subject,
            html,
            logId: log.id,
            category: template.category,
        }, {
            delay,
        });
        return { logId: log.id, status: delay > 0 ? 'SCHEDULED' : 'QUEUED' };
    }
    async getStats() {
        const totalTemplates = await this.prisma.template.count();
        const totalSent = await this.prisma.sendLog.count({
            where: { status: 'SENT' },
        });
        const totalFailed = await this.prisma.sendLog.count({
            where: { status: 'FAILED' },
        });
        const recentLogs = await this.prisma.sendLog.findMany({
            take: 5,
            orderBy: { sentAt: 'desc' },
        });
        return {
            totalTemplates,
            totalSent,
            totalFailed,
            recentLogs,
        };
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map