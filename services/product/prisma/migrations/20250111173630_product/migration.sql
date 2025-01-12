-- CreateEnum
CREATE TYPE "status" AS ENUM ('DRAFT', 'PUBLISHED', 'UNLISTED');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "status" NOT NULL DEFAULT 'DRAFT',
    "inventoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
