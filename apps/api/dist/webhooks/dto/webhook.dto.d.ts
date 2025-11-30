export declare class CreateWebhookDto {
    url: string;
    events: string[];
    isActive?: boolean;
}
export declare class UpdateWebhookDto {
    url?: string;
    events?: string[];
    isActive?: boolean;
}
