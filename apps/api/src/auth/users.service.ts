import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
    email: string;
    password: string;
    role?: Role;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    role?: Role;
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const { email, password, role } = createUserDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Validate password
        if (!password || password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || Role.VIEWER,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.findOne(id);

        const updateData: any = {};

        if (updateUserDto.email) {
            // Check if email is already taken by another user
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email is already taken');
            }

            updateData.email = updateUserDto.email;
        }

        if (updateUserDto.password) {
            if (updateUserDto.password.length < 6) {
                throw new BadRequestException('Password must be at least 6 characters long');
            }
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (updateUserDto.role) {
            updateData.role = updateUserDto.role;
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'User deleted successfully' };
    }

    async validateUser(email: string, password: string) {
        const user = await this.findByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}
