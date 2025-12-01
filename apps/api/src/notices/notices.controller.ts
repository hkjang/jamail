import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('notices')
export class NoticesController {
    constructor(private readonly noticesService: NoticesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    create(@Body() createNoticeDto: CreateNoticeDto, @Req() req) {
        return this.noticesService.create(createNoticeDto, req.user.id);
    }

    @Get()
    findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '5') {
        return this.noticesService.findAll(+page, +limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.noticesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
        return this.noticesService.update(id, updateNoticeDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.noticesService.remove(id);
    }
}
