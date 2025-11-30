import { IsNotEmpty, IsString, IsInt, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateSmtpConfigDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsInt()
    port: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    secure?: boolean;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @IsOptional()
    @IsArray()
    categories?: string[];
}

export class UpdateSmtpConfigDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    host?: string;

    @IsOptional()
    @IsInt()
    port?: number;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsBoolean()
    secure?: boolean;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @IsOptional()
    @IsArray()
    categories?: string[];
}
