/*
  Warnings:

  - A unique constraint covering the columns `[hanzi,pinyin]` on the table `Word` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Word_hanzi_key";

-- CreateIndex
CREATE UNIQUE INDEX "Word_hanzi_pinyin_key" ON "Word"("hanzi", "pinyin");
