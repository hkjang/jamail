import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';

@Controller('webhooks')
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) { }

    @Post()
    create(@Body() createWebhookDto: CreateWebhookDto) {
        return this.webhooksService.create(createWebhookDto);
    }

    @Get()
    findAll() {
        return this.webhooksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.webhooksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
        return this.webhooksService.update(id, updateWebhookDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.webhooksService.remove(id);
    }

    @Get(':id/deliveries')
    getDeliveries(@Param('id') id: string) {
        return this.webhooksService.getDeliveries(id);
    }

    @Post(':id/test')
    testWebhook(@Param('id') id: string) {
        return this.webhooksService.testWebhook(id);
    }
}
