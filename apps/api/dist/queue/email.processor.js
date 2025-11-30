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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const mail_service_1 = require("../mail/mail.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EmailProcessor = class EmailProcessor extends bullmq_1.WorkerHost {
    mailService;
    prisma;
    constructor(mailService, prisma) {
        super();
        this.mailService = mailService;
        this.prisma = prisma;
    }
    async process(job) {
        const { templateId, recipient, subject, html, logId, category } = job.data;
        try {
            const info = await this.mailService.sendEmail(recipient, subject, html, category);
            await this.prisma.sendLog.update({
                where: { id: logId },
                data: {
                    status: client_1.SendStatus.SENT,
                    smtpResponse: JSON.stringify(info),
                },
            });
            return info;
        }
        catch (error) {
            await this.prisma.sendLog.update({
                where: { id: logId },
                data: {
                    status: client_1.SendStatus.FAILED,
                    errorReason: error.message,
                },
            });
            throw error;
        }
    }
};
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = __decorate([
    (0, bullmq_1.Processor)('email-sending'),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        prisma_service_1.PrismaService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map