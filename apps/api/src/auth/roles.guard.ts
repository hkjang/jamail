import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user, apiKey } = context.switchToHttp().getRequest();

        // If API Key is used, bypass role check (API Key uses Scopes instead)
        if (apiKey) {
            return true;
        }

        if (!user) return false; // No user attached

        // If user has 'role' property (from DB User)
        return requiredRoles.some((role) => user.role === role);
    }
}
