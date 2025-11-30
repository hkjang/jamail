import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { CreateSmtpConfigDto, UpdateSmtpConfigDto } from './dto/smtp-config.dto';

@Controller('smtp')
export class SmtpController {
    constructor(private readonly smtpService: SmtpService) { }

    @Post()
    create(@Body() createSmtpDto: CreateSmtpConfigDto) {
        return this.smtpService.create(createSmtpDto);
    }

    @Get()
    findAll() {
        return this.smtpService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.smtpService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSmtpDto: UpdateSmtpConfigDto) {
        return this.smtpService.update(id, updateSmtpDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.smtpService.remove(id);
    }

    @Post(':id/test')
    testConnection(@Param('id') id: string) {
        return this.smtpService.testConnection(id);
    }
}
