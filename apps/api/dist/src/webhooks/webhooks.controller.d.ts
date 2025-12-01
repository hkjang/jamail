import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    create(createWebhookDto: CreateWebhookDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        events: string[];
        secret: string;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        events: string[];
        secret: string;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<({
        deliveries: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            attempts: number;
            event: string;
            webhookId: string;
            payload: import("@prisma/client/runtime/library").JsonValue;
            responseCode: number | null;
            responseBody: string | null;
            nextRetryAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        events: string[];
        secret: string;
        isActive: boolean;
    }) | null>;
    update(id: string, updateWebhookDto: UpdateWebhookDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        events: string[];
        secret: string;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        events: string[];
        secret: string;
        isActive: boolean;
    }>;
    getDeliveries(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        attempts: number;
        event: string;
        webhookId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        responseCode: number | null;
        responseBody: string | null;
        nextRetryAt: Date | null;
    }[]>;
    testWebhook(id: string): Promise<{
        message: string;
        deliveryId: string;
    }>;
}
