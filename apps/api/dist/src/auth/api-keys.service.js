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
exports.ApiKeysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let ApiKeysService = class ApiKeysService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateKey() {
        return 'sk_' + crypto.randomBytes(24).toString('hex');
    }
    hashKey(key) {
        return crypto.createHash('sha256').update(key).digest('hex');
    }
    async create(createApiKeyDto) {
        const key = this.generateKey();
        const keyHash = this.hashKey(key);
        const apiKey = await this.prisma.apiKey.create({
            data: {
                name: createApiKeyDto.name,
                keyHash,
                scopes: createApiKeyDto.scopes,
                expiresAt: createApiKeyDto.expiresAt,
            },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
        });
        return { ...apiKey, key };
    }
    async findAll() {
        return this.prisma.apiKey.findMany({
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const apiKey = await this.prisma.apiKey.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
        });
        if (!apiKey) {
            throw new common_1.NotFoundException('API Key not found');
        }
        return apiKey;
    }
    async update(id, updateApiKeyDto) {
        await this.findOne(id);
        return this.prisma.apiKey.update({
            where: { id },
            data: {
                name: updateApiKeyDto.name,
                scopes: updateApiKeyDto.scopes,
                expiresAt: updateApiKeyDto.expiresAt,
            },
            select: {
                id: true,
                name: true,
                scopes: true,
                expiresAt: true,
                createdAt: true,
                lastUsedAt: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.apiKey.delete({
            where: { id },
        });
        return { message: 'API Key deleted successfully' };
    }
    async validateKey(key) {
        const keyHash = this.hashKey(key);
        const apiKey = await this.prisma.apiKey.findUnique({
            where: { keyHash },
        });
        if (!apiKey) {
            return null;
        }
        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return null;
        }
        await this.prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        });
        return apiKey;
    }
};
exports.ApiKeysService = ApiKeysService;
exports.ApiKeysService = ApiKeysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiKeysService);
//# sourceMappingURL=api-keys.service.js.map