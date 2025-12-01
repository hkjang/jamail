import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { CreateTranslationDto, UpdateTranslationDto } from './dto/translation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Roles } from '../auth/roles.decorator';
import { Scopes } from '../auth/scopes.decorator';
import { Role } from '@prisma/client';

@Controller('templates')
@UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
export class TranslationsController {
    constructor(private readonly translationsService: TranslationsService) { }

    @Post(':id/translations')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    create(@Param('id') templateId: string, @Body() createTranslationDto: CreateTranslationDto) {
        return this.translationsService.create(templateId, createTranslationDto);
    }

    @Get(':id/translations')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    findAll(@Param('id') templateId: string) {
        return this.translationsService.findAll(templateId);
    }

    @Get(':id/translations/:lang')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    findOne(@Param('id') templateId: string, @Param('lang') language: string) {
        return this.translationsService.findOne(templateId, language);
    }

    @Put(':id/translations/:lang')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    update(
        @Param('id') templateId: string,
        @Param('lang') language: string,
        @Body() updateTranslationDto: UpdateTranslationDto,
    ) {
        return this.translationsService.update(templateId, language, updateTranslationDto);
    }

    @Delete(':id/translations/:lang')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    remove(@Param('id') templateId: string, @Param('lang') language: string) {
        return this.translationsService.remove(templateId, language);
    }

    @Post(':id/translations/:lang/set-default')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    setDefault(@Param('id') templateId: string, @Param('lang') language: string) {
        return this.translationsService.setDefault(templateId, language);
    }
}
