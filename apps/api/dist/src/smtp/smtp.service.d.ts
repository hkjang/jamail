import { PrismaService } from '../prisma/prisma.service';
import { CreateSmtpConfigDto, UpdateSmtpConfigDto } from './dto/smtp-config.dto';
export declare class SmtpService {
    private prisma;
    private smtpCache;
    constructor(prisma: PrismaService);
    create(createSmtpDto: CreateSmtpConfigDto): Promise<{
        id: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        port: number;
        host: string;
        username: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }>;
    findAll(): Promise<{
        id: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        port: number;
        host: string;
        username: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        port: number;
        host: string;
        username: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    } | null>;
    update(id: string, updateSmtpDto: UpdateSmtpConfigDto): Promise<{
        id: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        port: number;
        host: string;
        username: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }>;
    remove(id: string): Promise<{
        id: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        port: number;
        host: string;
        username: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }>;
    selectSmtpConfig(category?: string): Promise<any>;
    testConnection(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
