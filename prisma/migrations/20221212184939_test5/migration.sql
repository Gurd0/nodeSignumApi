/*
  Warnings:

  - You are about to alter the column `height` on the `Block` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Block" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "height" INTEGER NOT NULL
);
INSERT INTO "new_Block" ("height", "id", "name") SELECT "height", "id", "name" FROM "Block";
DROP TABLE "Block";
ALTER TABLE "new_Block" RENAME TO "Block";
CREATE UNIQUE INDEX "Block_name_key" ON "Block"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
