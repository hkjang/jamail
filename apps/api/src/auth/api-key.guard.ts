import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            throw new UnauthorizedException('API Key missing');
        }

        const key = await this.prisma.apiKey.findUnique({
            where: { keyHash: apiKey },
        });

        if (!key) {
            throw new UnauthorizedException('Invalid API Key');
        }

        // Update last used
        await this.prisma.apiKey.update({
            where: { id: key.id },
            data: { lastUsedAt: new Date() },
        });

        request.apiKey = key;
        return true;
    }
}
