import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeysService } from './api-keys.service';
export declare class ApiKeyGuard implements CanActivate {
    private apiKeysService;
    private reflector;
    constructor(apiKeysService: ApiKeysService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
