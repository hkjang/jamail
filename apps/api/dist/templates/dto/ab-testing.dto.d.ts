export declare class CreateVariantDto {
    variantName: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    trafficSplit?: number;
    variantGroup?: string;
}
export declare class UpdateTrafficSplitDto {
    trafficSplit: number;
}
export declare class DeclareWinnerDto {
    winnerVersionId: string;
}
