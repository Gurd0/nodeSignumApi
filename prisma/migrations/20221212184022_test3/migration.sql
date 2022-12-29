/*
  Warnings:

  - The primary key for the `Block` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Block" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL
);
INSERT INTO "new_Block" ("id", "name") SELECT "id", "name" FROM "Block";
DROP TABLE "Block";
ALTER TABLE "new_Block" RENAME TO "Block";
CREATE UNIQUE INDEX "Block_name_key" ON "Block"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
