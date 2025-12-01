"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysController = void 0;
const common_1 = require("@nestjs/common");
const api_keys_service_1 = require("./api-keys.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const roles_guard_1 = require("./roles.guard");
const roles_decorator_1 = require("./roles.decorator");
const client_1 = require("@prisma/client");
const audit_service_1 = require("../audit/audit.service");
let ApiKeysController = class ApiKeysController {
    apiKeysService;
    auditService;
    constructor(apiKeysService, auditService) {
        this.apiKeysService = apiKeysService;
        this.auditService = auditService;
    }
    async create(createApiKeyDto, req) {
        const apiKey = await this.apiKeysService.create(createApiKeyDto);
        await this.auditService.log('CREATE_API_KEY', 'ApiKey', apiKey.id, req.user.id, { name: apiKey.name, scopes: apiKey.scopes });
        return apiKey;
    }
    async findAll() {
        return this.apiKeysService.findAll();
    }
    async findOne(id) {
        return this.apiKeysService.findOne(id);
    }
    async update(id, updateApiKeyDto, req) {
        const apiKey = await this.apiKeysService.update(id, updateApiKeyDto);
        await this.auditService.log('UPDATE_API_KEY', 'ApiKey', id, req.user.id, updateApiKeyDto);
        return apiKey;
    }
    async remove(id, req) {
        const result = await this.apiKeysService.remove(id);
        await this.auditService.log('DELETE_API_KEY', 'ApiKey', id, req.user.id);
        return result;
    }
};
exports.ApiKeysController = ApiKeysController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeysController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiKeysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeysController.prototype, "remove", null);
exports.ApiKeysController = ApiKeysController = __decorate([
    (0, common_1.Controller)('auth/api-keys'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [api_keys_service_1.ApiKeysService,
        audit_service_1.AuditService])
], ApiKeysController);
//# sourceMappingURL=api-keys.controller.js.map