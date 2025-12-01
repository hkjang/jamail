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
exports.ABTestingController = void 0;
const common_1 = require("@nestjs/common");
const ab_testing_service_1 = require("./ab-testing.service");
const ab_testing_dto_1 = require("../templates/dto/ab-testing.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const api_key_guard_1 = require("../auth/api-key.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const scopes_decorator_1 = require("../auth/scopes.decorator");
const client_1 = require("@prisma/client");
let ABTestingController = class ABTestingController {
    abTestingService;
    constructor(abTestingService) {
        this.abTestingService = abTestingService;
    }
    createVariant(templateId, createVariantDto) {
        return this.abTestingService.createVariant(templateId, createVariantDto);
    }
    getVariants(templateId) {
        return this.abTestingService.getVariants(templateId);
    }
    updateTrafficSplit(versionId, updateTrafficSplitDto) {
        return this.abTestingService.updateTrafficSplit(versionId, updateTrafficSplitDto.trafficSplit);
    }
    getABTestResults(templateId) {
        return this.abTestingService.getABTestResults(templateId);
    }
    declareWinner(templateId, declareWinnerDto) {
        return this.abTestingService.declareWinner(templateId, declareWinnerDto.winnerVersionId);
    }
    trackEvent(versionId, event) {
        return this.abTestingService.recordEvent(versionId, event);
    }
};
exports.ABTestingController = ABTestingController;
__decorate([
    (0, common_1.Post)('templates/:id/variants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ab_testing_dto_1.CreateVariantDto]),
    __metadata("design:returntype", void 0)
], ABTestingController.prototype, "createVariant", null);
__decorate([
    (0, common_1.Get)('templates/:id/variants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_templates'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ABTestingController.prototype, "getVariants", null);
__decorate([
    (0, common_1.Patch)('variants/:id/traffic-split'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ab_testing_dto_1.UpdateTrafficSplitDto]),
    __metadata("design:returntype", void 0)
], ABTestingController.prototype, "updateTrafficSplit", null);
__decorate([
    (0, common_1.Get)('templates/:id/results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_templates'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ABTestingController.prototype, "getABTestResults", null);
__decorate([
    (0, common_1.Post)('templates/:id/declare-winner'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ab_testing_dto_1.DeclareWinnerDto]),
    __metadata("design:returntype", void 0)
], ABTestingController.prototype, "declareWinner", null);
__decorate([
    (0, common_1.Post)('track/:versionId/:event'),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Param)('event')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ABTestingController.prototype, "trackEvent", null);
exports.ABTestingController = ABTestingController = __decorate([
    (0, common_1.Controller)('ab-testing'),
    __metadata("design:paramtypes", [ab_testing_service_1.ABTestingService])
], ABTestingController);
//# sourceMappingURL=ab-testing.controller.js.map