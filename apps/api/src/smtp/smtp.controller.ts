import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { CreateSmtpConfigDto, UpdateSmtpConfigDto } from './dto/smtp-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Roles } from '../auth/roles.decorator';
import { Scopes } from '../auth/scopes.decorator';
import { Role } from '@prisma/client';

@Controller('smtp')
@UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
export class SmtpController {
    constructor(private readonly smtpService: SmtpService) { }

    @Post()
    @Roles(Role.ADMIN)
    @Scopes('manage_settings')
    create(@Body() createSmtpDto: CreateSmtpConfigDto) {
        return this.smtpService.create(createSmtpDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_settings')
    findAll() {
        return this.smtpService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_settings')
    findOne(@Param('id') id: string) {
        return this.smtpService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @Scopes('manage_settings')
    update(@Param('id') id: string, @Body() updateSmtpDto: UpdateSmtpConfigDto) {
        return this.smtpService.update(id, updateSmtpDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @Scopes('manage_settings')
    remove(@Param('id') id: string) {
        return this.smtpService.remove(id);
    }

    @Post(':id/test')
    @Roles(Role.ADMIN)
    @Scopes('manage_settings')
    testConnection(@Param('id') id: string) {
        return this.smtpService.testConnection(id);
    }
}
