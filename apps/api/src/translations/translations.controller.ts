import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { CreateTranslationDto, UpdateTranslationDto } from './dto/translation.dto';

@Controller('templates')
export class TranslationsController {
    constructor(private readonly translationsService: TranslationsService) { }

    @Post(':id/translations')
    create(@Param('id') templateId: string, @Body() createTranslationDto: CreateTranslationDto) {
        return this.translationsService.create(templateId, createTranslationDto);
    }

    @Get(':id/translations')
    findAll(@Param('id') templateId: string) {
        return this.translationsService.findAll(templateId);
    }

    @Get(':id/translations/:lang')
    findOne(@Param('id') templateId: string, @Param('lang') language: string) {
        return this.translationsService.findOne(templateId, language);
    }

    @Put(':id/translations/:lang')
    update(
        @Param('id') templateId: string,
        @Param('lang') language: string,
        @Body() updateTranslationDto: UpdateTranslationDto,
    ) {
        return this.translationsService.update(templateId, language, updateTranslationDto);
    }

    @Delete(':id/translations/:lang')
    remove(@Param('id') templateId: string, @Param('lang') language: string) {
        return this.translationsService.remove(templateId, language);
    }

    @Post(':id/translations/:lang/set-default')
    setDefault(@Param('id') templateId: string, @Param('lang') language: string) {
        return this.translationsService.setDefault(templateId, language);
    }
}
