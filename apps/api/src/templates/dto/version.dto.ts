import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { TemplateType } from '@prisma/client';

export class CreateTemplateVersionDto {
    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    htmlContent: string;

    @IsOptional()
    @IsString()
    textContent?: string;

    @IsOptional()
    @IsEnum(TemplateType)
    type?: TemplateType;

    @IsOptional()
    schema?: any;
}
