/*
  Warnings:

  - You are about to drop the column `order` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" REAL,
    "collectionId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "prevId" INTEGER,
    "nextId" INTEGER,
    CONSTRAINT "Item_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "Item" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "Item" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("collectionId", "description", "id", "listId", "name") SELECT "collectionId", "description", "id", "listId", "name" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_prevId_key" ON "Item"("prevId");
CREATE UNIQUE INDEX "Item_nextId_key" ON "Item"("nextId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
