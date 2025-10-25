/*
  Warnings:

  - You are about to drop the column `companyId` on the `JobApplication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."JobApplication" DROP CONSTRAINT "JobApplication_companyId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "companyId";
