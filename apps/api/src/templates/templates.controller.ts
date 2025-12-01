import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateTemplateVersionDto } from './dto/version.dto';
import { PreviewTemplateDto } from './dto/preview.dto';
import { SendEmailDto } from './dto/send.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Roles } from '../auth/roles.decorator';
import { Scopes } from '../auth/scopes.decorator';
import { Role } from '@prisma/client';

@Controller('templates')
@UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService,
        @InjectQueue('email-sending') private emailQueue: Queue,
    ) { }

    @Post()
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    create(@Body() createTemplateDto: CreateTemplateDto) {
        return this.templatesService.create(createTemplateDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    findAll(@Query('search') search?: string) {
        if (search) {
            return this.templatesService.search(search);
        }
        return this.templatesService.findAll();
    }

    @Post('preview')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    async preview(@Body() previewDto: PreviewTemplateDto) {
        return {
            html: await this.templatesService.preview(previewDto.htmlContent, previewDto.variables),
        };
    }

    @Get('stats/overview')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    async getStats() {
        return this.templatesService.getStats();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    findOne(@Param('id') id: string) {
        return this.templatesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
        return this.templatesService.update(id, updateTemplateDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @Scopes('delete_templates')
    remove(@Param('id') id: string) {
        return this.templatesService.remove(id);
    }

    @Post(':id/versions')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    createVersion(@Param('id') id: string, @Body() createVersionDto: CreateTemplateVersionDto) {
        return this.templatesService.createVersion(id, createVersionDto);
    }

    @Post(':id/send')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('send_email')
    async send(@Param('id') id: string, @Body() sendDto: SendEmailDto) {
        return this.templatesService.send(id, sendDto.recipient, sendDto.variables, this.emailQueue, sendDto.scheduledAt);
    }
}
