import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TemplateCategory } from '@prisma/client';

export class CreateTemplateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TemplateCategory)
    category?: TemplateCategory;
}

export class UpdateTemplateDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TemplateCategory)
    category?: TemplateCategory;
}
