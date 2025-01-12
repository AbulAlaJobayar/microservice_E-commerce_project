/*
  Warnings:

  - The `status` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED', 'UNLISTED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

-- DropEnum
DROP TYPE "status";
