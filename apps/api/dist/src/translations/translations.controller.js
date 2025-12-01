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
exports.TranslationsController = void 0;
const common_1 = require("@nestjs/common");
const translations_service_1 = require("./translations.service");
const translation_dto_1 = require("./dto/translation.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const api_key_guard_1 = require("../auth/api-key.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const scopes_decorator_1 = require("../auth/scopes.decorator");
const client_1 = require("@prisma/client");
let TranslationsController = class TranslationsController {
    translationsService;
    constructor(translationsService) {
        this.translationsService = translationsService;
    }
    create(templateId, createTranslationDto) {
        return this.translationsService.create(templateId, createTranslationDto);
    }
    findAll(templateId) {
        return this.translationsService.findAll(templateId);
    }
    findOne(templateId, language) {
        return this.translationsService.findOne(templateId, language);
    }
    update(templateId, language, updateTranslationDto) {
        return this.translationsService.update(templateId, language, updateTranslationDto);
    }
    remove(templateId, language) {
        return this.translationsService.remove(templateId, language);
    }
    setDefault(templateId, language) {
        return this.translationsService.setDefault(templateId, language);
    }
};
exports.TranslationsController = TranslationsController;
__decorate([
    (0, common_1.Post)(':id/translations'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, translation_dto_1.CreateTranslationDto]),
    __metadata("design:returntype", void 0)
], TranslationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/translations'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_templates'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TranslationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/translations/:lang'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR, client_1.Role.VIEWER),
    (0, scopes_decorator_1.Scopes)('read_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TranslationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/translations/:lang'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lang')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, translation_dto_1.UpdateTranslationDto]),
    __metadata("design:returntype", void 0)
], TranslationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/translations/:lang'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TranslationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/translations/:lang/set-default'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.OPERATOR),
    (0, scopes_decorator_1.Scopes)('write_templates'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TranslationsController.prototype, "setDefault", null);
exports.TranslationsController = TranslationsController = __decorate([
    (0, common_1.Controller)('templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [translations_service_1.TranslationsService])
], TranslationsController);
//# sourceMappingURL=translations.controller.js.map