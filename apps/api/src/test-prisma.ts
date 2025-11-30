import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();

    console.log('Checking Prisma Client properties...');

    const models = [
        'templateTranslation',
        'webhook',
        'webhookDelivery'
    ];

    for (const model of models) {
        if (model in prisma) {
            console.log(`✅ ${model} exists`);
        } else {
            console.error(`❌ ${model} DOES NOT exist`);
        }
    }

    await prisma.$disconnect();
}

main();
