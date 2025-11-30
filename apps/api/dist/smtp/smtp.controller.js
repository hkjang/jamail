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
exports.SmtpController = void 0;
const common_1 = require("@nestjs/common");
const smtp_service_1 = require("./smtp.service");
const smtp_config_dto_1 = require("./dto/smtp-config.dto");
let SmtpController = class SmtpController {
    smtpService;
    constructor(smtpService) {
        this.smtpService = smtpService;
    }
    create(createSmtpDto) {
        return this.smtpService.create(createSmtpDto);
    }
    findAll() {
        return this.smtpService.findAll();
    }
    findOne(id) {
        return this.smtpService.findOne(id);
    }
    update(id, updateSmtpDto) {
        return this.smtpService.update(id, updateSmtpDto);
    }
    remove(id) {
        return this.smtpService.remove(id);
    }
    testConnection(id) {
        return this.smtpService.testConnection(id);
    }
};
exports.SmtpController = SmtpController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [smtp_config_dto_1.CreateSmtpConfigDto]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, smtp_config_dto_1.UpdateSmtpConfigDto]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "testConnection", null);
exports.SmtpController = SmtpController = __decorate([
    (0, common_1.Controller)('smtp'),
    __metadata("design:paramtypes", [smtp_service_1.SmtpService])
], SmtpController);
//# sourceMappingURL=smtp.controller.js.map