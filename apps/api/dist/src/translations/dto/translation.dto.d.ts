export declare class CreateTranslationDto {
    language: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    isDefault?: boolean;
}
export declare class UpdateTranslationDto {
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    isDefault?: boolean;
}
