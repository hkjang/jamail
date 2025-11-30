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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const template_dto_1 = require("./dto/template.dto");
const version_dto_1 = require("./dto/version.dto");
const preview_dto_1 = require("./dto/preview.dto");
const send_dto_1 = require("./dto/send.dto");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let TemplatesController = class TemplatesController {
    templatesService;
    emailQueue;
    constructor(templatesService, emailQueue) {
        this.templatesService = templatesService;
        this.emailQueue = emailQueue;
    }
    create(createTemplateDto) {
        return this.templatesService.create(createTemplateDto);
    }
    findAll() {
        return this.templatesService.findAll();
    }
    async preview(previewDto) {
        return {
            html: await this.templatesService.preview(previewDto.htmlContent, previewDto.variables),
        };
    }
    async getStats() {
        return this.templatesService.getStats();
    }
    findOne(id) {
        return this.templatesService.findOne(id);
    }
    update(id, updateTemplateDto) {
        return this.templatesService.update(id, updateTemplateDto);
    }
    remove(id) {
        return this.templatesService.remove(id);
    }
    createVersion(id, createVersionDto) {
        return this.templatesService.createVersion(id, createVersionDto);
    }
    async send(id, sendDto) {
        return this.templatesService.send(id, sendDto.recipient, sendDto.variables, this.emailQueue, sendDto.scheduledAt);
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preview_dto_1.PreviewTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "preview", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, template_dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/versions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, version_dto_1.CreateTemplateVersionDto]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_dto_1.SendEmailDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "send", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    __param(1, (0, bullmq_1.InjectQueue)('email-sending')),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService,
        bullmq_2.Queue])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map