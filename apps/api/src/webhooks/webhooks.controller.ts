import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Roles } from '../auth/roles.decorator';
import { Scopes } from '../auth/scopes.decorator';
import { Role } from '@prisma/client';

@Controller('webhooks')
@UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) { }

    @Post()
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('manage_webhooks')
    create(@Body() createWebhookDto: CreateWebhookDto) {
        return this.webhooksService.create(createWebhookDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_webhooks')
    findAll() {
        return this.webhooksService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_webhooks')
    findOne(@Param('id') id: string) {
        return this.webhooksService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('manage_webhooks')
    update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
        return this.webhooksService.update(id, updateWebhookDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('manage_webhooks')
    remove(@Param('id') id: string) {
        return this.webhooksService.remove(id);
    }

    @Get(':id/deliveries')
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_webhooks')
    getDeliveries(@Param('id') id: string) {
        return this.webhooksService.getDeliveries(id);
    }

    @Post(':id/test')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('manage_webhooks')
    testWebhook(@Param('id') id: string) {
        return this.webhooksService.testWebhook(id);
    }
}
