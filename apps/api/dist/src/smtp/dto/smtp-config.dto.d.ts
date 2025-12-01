export declare class CreateSmtpConfigDto {
    name: string;
    host: string;
    port: number;
    username?: string;
    password?: string;
    secure?: boolean;
    isDefault?: boolean;
    categories?: string[];
}
export declare class UpdateSmtpConfigDto {
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    secure?: boolean;
    isDefault?: boolean;
    categories?: string[];
}
