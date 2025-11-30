import { SmtpService } from './smtp.service';
import { CreateSmtpConfigDto, UpdateSmtpConfigDto } from './dto/smtp-config.dto';
export declare class SmtpController {
    private readonly smtpService;
    constructor(smtpService: SmtpService);
    create(createSmtpDto: CreateSmtpConfigDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        port: number;
        host: string;
        username: string;
        password: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        port: number;
        host: string;
        username: string;
        password: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        port: number;
        host: string;
        username: string;
        password: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    } | null>;
    update(id: string, updateSmtpDto: UpdateSmtpConfigDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        port: number;
        host: string;
        username: string;
        password: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        port: number;
        host: string;
        username: string;
        password: string;
        secure: boolean;
        isDefault: boolean;
        categories: string[];
    }>;
    testConnection(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
