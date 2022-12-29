/*
  Warnings:

  - You are about to drop the column `collectionId` on the `NFT` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `NFT` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ipfs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "collection" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NFT" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL
);
INSERT INTO "new_NFT" ("id", "owner") SELECT "id", "owner" FROM "NFT";
DROP TABLE "NFT";
ALTER TABLE "new_NFT" RENAME TO "NFT";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
