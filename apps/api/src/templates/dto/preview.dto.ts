import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class PreviewTemplateDto {
    @IsNotEmpty()
    @IsString()
    htmlContent: string;

    @IsOptional()
    @IsObject()
    variables?: Record<string, any>;
}
