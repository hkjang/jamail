import { TemplateCategory } from '@prisma/client';
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    category?: TemplateCategory;
}
export declare class UpdateTemplateDto {
    name?: string;
    description?: string;
    category?: TemplateCategory;
}
