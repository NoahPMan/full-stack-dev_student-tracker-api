/*
  Warnings:

  - A unique constraint covering the columns `[userId,code]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Homework` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/

-- Drop legacy UNIQUE on courses.code (may exist as a constraint OR an index)
ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_code_key";
DROP INDEX IF EXISTS "courses_code_key";

-- AlterTable
ALTER TABLE "Homework" ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable (safe for non-empty tables)
ALTER TABLE "courses"
  ADD COLUMN IF NOT EXISTS "userId" TEXT,
  ALTER COLUMN "credits" DROP NOT NULL;

-- Backfill any existing rows so NOT NULL is possible
UPDATE "courses"
SET "userId" = 'legacy'
WHERE "userId" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "courses"
  ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "courses_userId_idx" ON "courses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_userId_code_key" ON "courses"("userId", "code");

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
