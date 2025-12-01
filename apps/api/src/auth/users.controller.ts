import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

export interface LoginDto {
    email: string;
    password: string;
}

@Controller('auth')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly auditService: AuditService,
    ) { }

    @Post('register')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async register(@Body() createUserDto: CreateUserDto, @Request() req) {
        const user = await this.usersService.create(createUserDto);

        // Audit log
        await this.auditService.log(
            'CREATE_USER',
            'User',
            user.id,
            req.user.id,
            { email: user.email, role: user.role },
        );

        return user;
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.usersService.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);

        // Audit log
        await this.auditService.log(
            user.id,
            'USER_LOGIN',
            'User',
            user.id,
        );

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req) {
        return req.user;
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    async findAll() {
        return this.usersService.findAll();
    }

    @Get('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
        const user = await this.usersService.update(id, updateUserDto);

        // Audit log
        await this.auditService.log(
            req.user.id,
            'UPDATE_USER',
            'User',
            id,
            updateUserDto,
        );

        return user;
    }

    @Delete('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string, @Request() req) {
        // Prevent deleting yourself
        if (id === req.user.id) {
            throw new UnauthorizedException('You cannot delete your own account');
        }

        const result = await this.usersService.remove(id);

        // Audit log
        await this.auditService.log(
            req.user.id,
            'DELETE_USER',
            'User',
            id,
        );

        return result;
    }
}
