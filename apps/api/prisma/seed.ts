import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
    console.log('Seeding users...');
    const email = 'admin@example.com';
    const password = 'admin'; // Change this in production!
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log(`  - Admin user created/updated: ${user.email}`);
}

async function seedTemplates() {
    console.log('Seeding templates...');
    // Add template seeding logic here in the future
    // Example:
    // await prisma.template.create(...)
}

async function seedSmtpConfigs() {
    console.log('Seeding SMTP configs...');
    // Add SMTP config seeding logic here
}

async function main() {
    console.log('Start seeding ...');

    await seedUsers();
    await seedTemplates();
    await seedSmtpConfigs();

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
