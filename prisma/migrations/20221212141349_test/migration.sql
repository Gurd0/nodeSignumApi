-- AlterTable
ALTER TABLE "NFT" ADD COLUMN "collectionId" TEXT;
ALTER TABLE "NFT" ADD COLUMN "image" TEXT;

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL PRIMARY KEY
);
