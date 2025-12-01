import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AssetsService {
    private uploadDir = path.join(process.cwd(), 'uploads');

    constructor(private prisma: PrismaService) {
        this.ensureUploadDir();
    }

    private async ensureUploadDir() {
        try {
            await fs.access(this.uploadDir);
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }

    async uploadImage(file: any) {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(this.uploadDir, filename);

        await fs.writeFile(filepath, file.buffer);

        // In production, you would upload to CDN and get the URL
        const url = `/uploads/${filename}`;

        const asset = await this.prisma.asset.create({
            data: {
                url,
                filename,
                size: file.size,
                mimeType: file.mimetype,
            },
        });

        return asset;
    }

    async findAll() {
        return this.prisma.asset.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(id: string) {
        const asset = await this.prisma.asset.findUnique({ where: { id } });
        if (!asset) {
            throw new Error('Asset not found');
        }

        // Delete file from disk
        const filepath = path.join(this.uploadDir, asset.filename);
        try {
            await fs.unlink(filepath);
        } catch (error) {
            console.error('Failed to delete file:', error);
        }

        return this.prisma.asset.delete({ where: { id } });
    }
}
