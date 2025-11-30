import { IsNotEmpty, IsString, IsOptional, IsJSON } from 'class-validator';

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
    variablesSchema?: any;
}
