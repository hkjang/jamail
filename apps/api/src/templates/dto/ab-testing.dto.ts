import { IsNotEmpty, IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateVariantDto {
    @IsNotEmpty()
    @IsString()
    variantName: string;

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
    @IsInt()
    @Min(0)
    @Max(100)
    trafficSplit?: number;

    @IsOptional()
    @IsString()
    variantGroup?: string;
}

export class UpdateTrafficSplitDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100)
    trafficSplit: number;
}

export class DeclareWinnerDto {
    @IsNotEmpty()
    @IsString()
    winnerVersionId: string;
}
