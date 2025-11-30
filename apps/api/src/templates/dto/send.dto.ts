import { IsNotEmpty, IsString, IsOptional, IsObject, IsEmail } from 'class-validator';

export class SendEmailDto {
    @IsNotEmpty()
    @IsEmail()
    recipient: string;

    @IsOptional()
    @IsObject()
    variables?: Record<string, any>;

    @IsOptional()
    @IsString()
    scheduledAt?: string; // ISO Date string
}
