import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
    constructor(private prisma: PrismaService) { }

    create(createNoticeDto: CreateNoticeDto, authorId: string) {
        return this.prisma.notice.create({
            data: {
                ...createNoticeDto,
                authorId,
            },
        });
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [total, notices] = await Promise.all([
            this.prisma.notice.count(),
            this.prisma.notice.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { email: true, id: true },
                    },
                },
            }),
        ]);

        return {
            data: notices,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    findOne(id: string) {
        return this.prisma.notice.findUnique({
            where: { id },
            include: {
                author: {
                    select: { email: true, id: true },
                },
            },
        });
    }

    update(id: string, updateNoticeDto: UpdateNoticeDto) {
        return this.prisma.notice.update({
            where: { id },
            data: updateNoticeDto,
        });
    }

    remove(id: string) {
        return this.prisma.notice.delete({
            where: { id },
        });
    }
}
