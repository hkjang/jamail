import { TranslationsService } from './translations.service';
import { CreateTranslationDto, UpdateTranslationDto } from './dto/translation.dto';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    create(templateId: string, createTranslationDto: CreateTranslationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    findAll(templateId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }[]>;
    findOne(templateId: string, language: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    } | null>;
    update(templateId: string, language: string, updateTranslationDto: UpdateTranslationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    remove(templateId: string, language: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
    setDefault(templateId: string, language: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        htmlContent: string;
        textContent: string | null;
        templateId: string;
        isDefault: boolean;
        language: string;
    }>;
}
