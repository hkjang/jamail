import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateTemplateVersionDto } from './dto/version.dto';
import { HtmlRenderService, TemplateSchema } from './html-render.service';

@Injectable()
export class TemplatesService {
    constructor(
        private prisma: PrismaService,
        private htmlRenderService: HtmlRenderService,
    ) { }

    async create(createTemplateDto: CreateTemplateDto) {
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

    async findOne(id: string) {
        return this.prisma.template.findUnique({
            where: { id },
            include: {
                versions: {
                    orderBy: { versionNumber: 'desc' },
                },
            },
        });
    }

    async update(id: string, updateTemplateDto: UpdateTemplateDto) {
        return this.prisma.template.update({
            where: { id },
            data: updateTemplateDto,
        });
    }

    async remove(id: string) {
        return this.prisma.template.delete({
            where: { id },
        });
    }

    async createVersion(templateId: string, createVersionDto: CreateTemplateVersionDto) {
        // 1. Get current max version number
        const lastVersion = await this.prisma.templateVersion.findFirst({
            where: { templateId },
            orderBy: { versionNumber: 'desc' },
        });

        const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

        // 2. Create new version
        const version = await this.prisma.templateVersion.create({
            data: {
                templateId,
                versionNumber: newVersionNumber,
                ...createVersionDto,
                schema: createVersionDto.schema,
            },
        });

        // 3. Update template current version pointer
        await this.prisma.template.update({
            where: { id: templateId },
            data: { currentVersionId: version.id },
        });

        return version;
    }

    async preview(htmlContent: string, variables: Record<string, any> = {}) {
        const Handlebars = (await import('handlebars')).default;
        const template = Handlebars.compile(htmlContent);
        return template(variables);
    }

    async validateVariables(schema: any, variables: any) {
        if (!schema) return true;
        const Ajv = require('ajv');
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(variables);
        if (!valid) throw new Error('Invalid variables: ' + JSON.stringify(validate.errors));
        return true;
    }

    async getVersions(templateId: string) {
        return this.prisma.templateVersion.findMany({
            where: { templateId },
            orderBy: { versionNumber: 'desc' },
        });
    }

    async send(templateId: string, recipient: string, variables: Record<string, any> = {}, queue: any, scheduledAt?: string) {
        // 1. Get current version
        const template = await this.findOne(templateId);
        if (!template || !template.currentVersionId) {
            throw new Error('Template or version not found');
        }

        const version = template.versions.find(v => v.id === template.currentVersionId);
        if (!version) throw new Error('Version not found');

        // 2. Validate Variables
        if (version.variablesSchema) {
            await this.validateVariables(version.variablesSchema, variables);
        }

        // 3. Render HTML
        const html = await this.preview(version.htmlContent, variables);
        const subject = await this.preview(version.subject, variables);

        // 4. Create Log (PENDING)
        const log = await this.prisma.sendLog.create({
            data: {
                templateId,
                recipient,
                subject,
                status: 'PENDING',
                metadata: scheduledAt ? { scheduledAt } : undefined,
            },
        });

        // 5. Calculate Delay
        let delay = 0;
        if (scheduledAt) {
            const scheduleTime = new Date(scheduledAt).getTime();
            const now = Date.now();
            delay = Math.max(0, scheduleTime - now);
        }

        // 6. Add to Queue
        await queue.add('email-sending', {
            templateId,
            recipient,
            subject,
            html,
            logId: log.id,
            category: template.category, // Pass category for SMTP routing
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

    async renderHtml(schema: TemplateSchema): Promise<string> {
        return this.htmlRenderService.renderFromSchema(schema);
    }
}
