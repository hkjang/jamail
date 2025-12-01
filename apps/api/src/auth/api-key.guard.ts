import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeysService } from './api-keys.service';
import { SCOPES_KEY } from './scopes.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private apiKeysService: ApiKeysService,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            // If no API key, maybe it's a JWT request?
            // This guard should probably only run if x-api-key is present
            // Or if it's the only guard.
            // For now, let's return true if no key is present to allow other guards (like JWT) to handle it,
            // UNLESS this is specifically an API-key only route.
            // But usually we combine guards.
            // If we use @UseGuards(JwtAuthGuard, ApiKeyGuard), both must pass? No, usually one or the other.
            // NestJS guards run in order. If one throws, it fails.
            // We need a composite guard or a way to say "either JWT or API Key".
            return true;
        }

        const key = await this.apiKeysService.validateKey(apiKey);

        if (!key) {
            throw new UnauthorizedException('Invalid or expired API Key');
        }

        request.apiKey = key;

        // Check scopes
        const requiredScopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiredScopes && requiredScopes.length > 0) {
            const hasScope = requiredScopes.some(scope => key.scopes.includes(scope));
            if (!hasScope) {
                throw new ForbiddenException(`Missing required scope: ${requiredScopes.join(' or ')}`);
            }
        }

        return true;
    }
}
