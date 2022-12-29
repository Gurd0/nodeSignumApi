/*
  Warnings:

  - Added the required column `ipfsCid` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NFT" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "ipfsCid" TEXT NOT NULL
);
INSERT INTO "new_NFT" ("id", "owner") SELECT "id", "owner" FROM "NFT";
DROP TABLE "NFT";
ALTER TABLE "new_NFT" RENAME TO "NFT";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
