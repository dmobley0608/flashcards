/*
  Warnings:

  - You are about to drop the `CategoryOnDecks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CategoryOnDecks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_CategoryToDeck" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToDeck_AB_unique" ON "_CategoryToDeck"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToDeck_B_index" ON "_CategoryToDeck"("B");
