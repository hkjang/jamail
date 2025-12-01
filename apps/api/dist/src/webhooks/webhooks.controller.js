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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const webhooks_service_1 = require("./webhooks.service");
const webhook_dto_1 = require("./dto/webhook.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const api_key_guard_1 = require("../auth/api-key.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const scopes_decorator_1 = require("../auth/scopes.decorator");
const client_1 = require("@prisma/client");
let WebhooksController = class WebhooksController {
    webhooksService;
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    create(createWebhookDto) {
        return this.webhooksService.create(createWebhookDto);
    }
    findAll() {
        return this.webhooksService.findAll();
    }
    findOne(id) {
        return this.webhooksService.findOne(id);
    }
    update(id, updateWebhookDto) {
        return this.webhooksService.update(id, updateWebhookDto);
    }
    remove(id) {
        return this.webhooksService.remove(id);
    }
    getDeliveries(id) {
        return this.webhooksService.getDeliveries(id);
    }
    testWebhook(id) {
        return this.webhooksService.testWebhook(id);
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('manage_webhooks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhook_dto_1.CreateWebhookDto]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_webhooks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_webhooks'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('manage_webhooks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, webhook_dto_1.UpdateWebhookDto]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('manage_webhooks'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/deliveries'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_webhooks'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "getDeliveries", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('manage_webhooks'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "testWebhook", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, common_1.Controller)('webhooks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map