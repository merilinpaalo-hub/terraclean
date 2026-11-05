-- Extensions for fuzzy and diacritic-insensitive search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wasteCode" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "howToCollect" TEXT NOT NULL,
    "whereToTake" TEXT NOT NULL,
    "isNational" BOOLEAN NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "synonyms" TEXT[],
    "condition" TEXT,
    "categoryId" TEXT NOT NULL,
    "whereToTake" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "sourcePageId" TEXT NOT NULL,
    "isGeneralTerm" BOOLEAN NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Item_categoryId_idx" ON "Item"("categoryId");

-- CreateIndex
CREATE INDEX "Item_sourcePageId_idx" ON "Item"("sourcePageId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
