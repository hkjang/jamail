import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
export declare class WebhooksService {
    private prisma;
    private webhookQueue;
    constructor(prisma: PrismaService, webhookQueue: Queue);
    create(webhookData: any): Promise<{
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
    update(id: string, updateData: any): Promise<{
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
    getDeliveries(webhookId: string): Promise<{
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
    trigger(event: string, payload: any): Promise<void>;
    testWebhook(id: string): Promise<{
        message: string;
        deliveryId: string;
    }>;
    generateSignature(payload: string, secret: string): string;
    private generateSecret;
}
