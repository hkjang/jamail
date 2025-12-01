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
    await seedNotices();

    console.log('Seeding finished.');
}

async function seedNotices() {
    console.log('Seeding notices...');
    const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
    if (!admin) {
        console.log('  - Admin user not found, skipping notices.');
        return;
    }

    const notices = [
        {
            title: '이메일 발송 프로세스 가이드',
            content: 'Jamail 이메일 발송 프로세스 안내. API 호출부터 Redis 큐, Worker 처리, SMTP 발송까지의 흐름과 문제 해결 방법을 설명합니다.\n\n자세한 내용은 문서를 참고하세요.',
        },
        {
            title: '템플릿 빌더 사용 가이드',
            content: '드래그 앤 드롭 템플릿 빌더 사용법. 텍스트, 이미지, 버튼 등 블록 활용법과 속성 편집 기능을 소개합니다.',
        },
        {
            title: '권한 관리 가이드',
            content: '역할 기반 접근 제어(RBAC) 가이드. 관리자, 운영자, 뷰어의 권한 범위와 API 키 사용 정책을 설명합니다.',
        },
        {
            title: 'Redis 역할 및 기능 가이드',
            content: 'Redis 역할 및 기능 가이드. 비동기 작업 큐(이메일, 웹훅) 관리와 아키텍처, 운영 팁을 다룹니다.',
        },
    ];

    for (const notice of notices) {
        await prisma.notice.create({
            data: {
                ...notice,
                authorId: admin.id,
            },
        });
    }
    console.log(`  - Created ${notices.length} notices.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
