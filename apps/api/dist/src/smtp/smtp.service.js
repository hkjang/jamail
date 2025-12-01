"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nodemailer = __importStar(require("nodemailer"));
let SmtpService = class SmtpService {
    prisma;
    smtpCache = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSmtpDto) {
        if (createSmtpDto.isDefault) {
            await this.prisma.smtpConfig.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }
        const config = await this.prisma.smtpConfig.create({
            data: createSmtpDto,
        });
        this.smtpCache.clear();
        return config;
    }
    async findAll() {
        return this.prisma.smtpConfig.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.smtpConfig.findUnique({
            where: { id },
        });
    }
    async update(id, updateSmtpDto) {
        if (updateSmtpDto.isDefault) {
            await this.prisma.smtpConfig.updateMany({
                where: { isDefault: true, NOT: { id } },
                data: { isDefault: false },
            });
        }
        const config = await this.prisma.smtpConfig.update({
            where: { id },
            data: updateSmtpDto,
        });
        this.smtpCache.clear();
        return config;
    }
    async remove(id) {
        const config = await this.prisma.smtpConfig.delete({
            where: { id },
        });
        this.smtpCache.clear();
        return config;
    }
    async selectSmtpConfig(category) {
        const cacheKey = category || 'default';
        if (this.smtpCache.has(cacheKey)) {
            return this.smtpCache.get(cacheKey);
        }
        let config;
        if (category) {
            config = await this.prisma.smtpConfig.findFirst({
                where: {
                    categories: {
                        has: category,
                    },
                },
            });
        }
        if (!config) {
            config = await this.prisma.smtpConfig.findFirst({
                where: { isDefault: true },
            });
        }
        if (!config) {
            config = await this.prisma.smtpConfig.findFirst();
        }
        if (config) {
            this.smtpCache.set(cacheKey, config);
        }
        return config;
    }
    async testConnection(id) {
        const config = await this.findOne(id);
        if (!config) {
            return { success: false, message: 'SMTP configuration not found' };
        }
        try {
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                    user: config.username,
                    pass: config.password,
                },
            });
            await transporter.verify();
            return { success: true, message: 'Connection successful' };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
};
exports.SmtpService = SmtpService;
exports.SmtpService = SmtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmtpService);
//# sourceMappingURL=smtp.service.js.map