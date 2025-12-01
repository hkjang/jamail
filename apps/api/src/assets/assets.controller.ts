import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) { }

    @Post('upload')
    @Roles(Role.ADMIN, Role.OPERATOR)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: any) {
        return this.assetsService.uploadImage(file);
    }

    @Get()
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    findAll() {
        return this.assetsService.findAll();
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.OPERATOR)
    remove(@Param('id') id: string) {
        return this.assetsService.remove(id);
    }
}
