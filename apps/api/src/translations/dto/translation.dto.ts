import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTranslationDto {
    @IsNotEmpty()
    @IsString()
    language: string;

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
    @IsBoolean()
    isDefault?: boolean;
}

export class UpdateTranslationDto {
    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    htmlContent?: string;

    @IsOptional()
    @IsString()
    textContent?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
