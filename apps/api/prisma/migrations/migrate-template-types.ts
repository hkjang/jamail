import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting template type migration...');

    // Update templates: if schema exists, set type to BUILDER, otherwise BASIC
    const templates = await prisma.template.findMany();

    let builderCount = 0;
    let basicCount = 0;

    for (const template of templates) {
        const newType = template.schema && template.schema !== null ? 'BUILDER' : 'BASIC';

        await prisma.template.update({
            where: { id: template.id },
            data: { type: newType },
        });

        if (newType === 'BUILDER') {
            builderCount++;
        } else {
            basicCount++;
        }

        console.log(`✓ Updated template "${template.name}" to type: ${newType}`);
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`   - ${builderCount} templates set to BUILDER`);
    console.log(`   - ${basicCount} templates set to BASIC`);

    // Update template versions
    const versions = await prisma.templateVersion.findMany();
    let versionBuilderCount = 0;
    let versionBasicCount = 0;

    for (const version of versions) {
        const newType = version.schema && version.schema !== null ? 'BUILDER' : 'BASIC';

        await prisma.templateVersion.update({
            where: { id: version.id },
            data: { type: newType },
        });

        if (newType === 'BUILDER') {
            versionBuilderCount++;
        } else {
            versionBasicCount++;
        }
    }

    console.log(`\n✅ Version migration completed!`);
    console.log(`   - ${versionBuilderCount} versions set to BUILDER`);
    console.log(`   - ${versionBasicCount} versions set to BASIC`);
}

main()
    .catch((e) => {
        console.error('❌ Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
