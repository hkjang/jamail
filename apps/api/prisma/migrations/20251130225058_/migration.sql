/*
  Warnings:

  - You are about to drop the column `abTestResults` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "abTestResults";

-- AlterTable
ALTER TABLE "TemplateVersion" ALTER COLUMN "updatedAt" DROP DEFAULT;
