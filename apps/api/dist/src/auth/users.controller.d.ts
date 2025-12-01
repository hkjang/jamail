import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from './users.service';
import { AuditService } from '../audit/audit.service';
export interface LoginDto {
    email: string;
    password: string;
}
export declare class UsersController {
    private readonly usersService;
    private readonly jwtService;
    private readonly auditService;
    constructor(usersService: UsersService, jwtService: JwtService, auditService: AuditService);
    register(createUserDto: CreateUserDto, req: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    getProfile(req: any): Promise<any>;
    findAll(): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
