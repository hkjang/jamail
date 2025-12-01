-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('BUILDER', 'BASIC');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "type" "TemplateType" NOT NULL DEFAULT 'BASIC';

-- AlterTable
ALTER TABLE "TemplateVersion" ADD COLUMN     "type" "TemplateType" NOT NULL DEFAULT 'BASIC';
