import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import type { CreateApiKeyDto, UpdateApiKeyDto } from './api-keys.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Controller('auth/api-keys')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApiKeysController {
    constructor(
        private readonly apiKeysService: ApiKeysService,
        private readonly auditService: AuditService,
    ) { }

    @Post()
    @Roles(Role.ADMIN, Role.OPERATOR)
    async create(@Body() createApiKeyDto: CreateApiKeyDto, @Request() req) {
        const apiKey = await this.apiKeysService.create(createApiKeyDto);

        // Audit log
        await this.auditService.log(
            'CREATE_API_KEY',
            'ApiKey',
            apiKey.id,
            req.user.id,
            { name: apiKey.name, scopes: apiKey.scopes },
        );

        return apiKey;
    }

    @Get()
    @Roles(Role.ADMIN, Role.OPERATOR)
    async findAll() {
        return this.apiKeysService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    async findOne(@Param('id') id: string) {
        return this.apiKeysService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    async update(@Param('id') id: string, @Body() updateApiKeyDto: UpdateApiKeyDto, @Request() req) {
        const apiKey = await this.apiKeysService.update(id, updateApiKeyDto);

        // Audit log
        await this.auditService.log(
            'UPDATE_API_KEY',
            'ApiKey',
            id,
            req.user.id,
            updateApiKeyDto,
        );

        return apiKey;
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    async remove(@Param('id') id: string, @Request() req) {
        const result = await this.apiKeysService.remove(id);

        // Audit log
        await this.auditService.log(
            'DELETE_API_KEY',
            'ApiKey',
            id,
            req.user.id,
        );

        return result;
    }
}
