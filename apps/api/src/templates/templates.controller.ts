import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { CreateTemplateVersionDto } from './dto/version.dto';
import { PreviewTemplateDto } from './dto/preview.dto';
import { SendEmailDto } from './dto/send.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('templates')
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService,
        @InjectQueue('email-sending') private emailQueue: Queue,
    ) { }

    @Post()
    create(@Body() createTemplateDto: CreateTemplateDto) {
        return this.templatesService.create(createTemplateDto);
    }

    @Get()
    findAll() {
        return this.templatesService.findAll();
    }

    @Post('preview')
    async preview(@Body() previewDto: PreviewTemplateDto) {
        return {
            html: await this.templatesService.preview(previewDto.htmlContent, previewDto.variables),
        };
    }

    @Get('stats/overview')
    async getStats() {
        return this.templatesService.getStats();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.templatesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
        return this.templatesService.update(id, updateTemplateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.templatesService.remove(id);
    }

    @Post(':id/versions')
    createVersion(@Param('id') id: string, @Body() createVersionDto: CreateTemplateVersionDto) {
        return this.templatesService.createVersion(id, createVersionDto);
    }

    @Post(':id/send')
    async send(@Param('id') id: string, @Body() sendDto: SendEmailDto) {
        return this.templatesService.send(id, sendDto.recipient, sendDto.variables, this.emailQueue, sendDto.scheduledAt);
    }
}
