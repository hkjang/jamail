"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function main() {
    const prisma = new client_1.PrismaClient();
    console.log('Checking Prisma Client properties...');
    const models = [
        'templateTranslation',
        'webhook',
        'webhookDelivery'
    ];
    for (const model of models) {
        if (model in prisma) {
            console.log(`✅ ${model} exists`);
        }
        else {
            console.error(`❌ ${model} DOES NOT exist`);
        }
    }
    await prisma.$disconnect();
}
main();
//# sourceMappingURL=test-prisma.js.map