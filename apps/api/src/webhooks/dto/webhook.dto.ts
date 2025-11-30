import { IsNotEmpty, IsString, IsArray, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class CreateWebhookDto {
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    events: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateWebhookDto {
    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    events?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
