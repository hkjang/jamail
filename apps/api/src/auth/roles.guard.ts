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
        const { user } = context.switchToHttp().getRequest();
        // If using API Key, we might map scopes to roles or bypass. 
        // For now, let's assume 'user' object is populated by AuthGuard (JWT or ApiKey).
        // If ApiKey is used, we might need a way to determine role.
        // Let's assume ApiKey has full access for now or map it later.

        if (!user) return false; // No user attached

        // If user has 'role' property (from DB User)
        return requiredRoles.some((role) => user.role === role);
    }
}
