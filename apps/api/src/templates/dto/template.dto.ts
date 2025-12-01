import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TemplateCategory, TemplateType } from '@prisma/client';

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

    @IsOptional()
    @IsEnum(TemplateType)
    type?: TemplateType;

    @IsOptional()
    schema?: any;
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

    @IsOptional()
    @IsEnum(TemplateType)
    type?: TemplateType;

    @IsOptional()
    schema?: any;
}
