-- AlterTable
ALTER TABLE "categories_on_posts" ALTER COLUMN "assignedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "createdAt" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET DATA TYPE TEXT;
