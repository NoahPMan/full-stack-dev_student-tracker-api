/*
  Warnings:

  - A unique constraint covering the columns `[userId,code]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Homework` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `courses` table without a default value. This is not possible if the table is not empty.
*/

-- -----------------------------------------
-- 1) Drop legacy UNIQUE on courses.code safely
--    (it may exist as a CONSTRAINT or an INDEX)
-- -----------------------------------------
ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_code_key";
DROP INDEX IF EXISTS "courses_code_key"; -- IF EXISTS prevents 42704 errors [1](https://www.aimadetools.com/blog/prisma-migrate-error-fix/)


-- -----------------------------------------
-- 2) Make Homework/Note columns match new model
-- -----------------------------------------
ALTER TABLE "Homework"
  ALTER COLUMN "courseId" DROP NOT NULL,
  ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Note"
  ALTER COLUMN "courseId" DROP NOT NULL,
  ALTER COLUMN "userId" SET NOT NULL;


-- -----------------------------------------
-- 3) Add courses.userId safely (works even if table already has rows)
-- -----------------------------------------
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


-- -----------------------------------------
-- 4) Indexes (idempotent)
--    If a previous attempt created these indexes before failing,
--    drop them safely and recreate.
-- -----------------------------------------
DROP INDEX IF EXISTS "courses_userId_idx";       -- avoids 42P07 relation exists [1](https://www.aimadetools.com/blog/prisma-migrate-error-fix/)
DROP INDEX IF EXISTS "courses_userId_code_key";  -- avoids 42P07 relation exists [1](https://www.aimadetools.com/blog/prisma-migrate-error-fix/)

CREATE INDEX "courses_userId_idx" ON "courses"("userId");
CREATE UNIQUE INDEX "courses_userId_code_key" ON "courses"("userId", "code");


-- -----------------------------------------
-- 5) Foreign keys (idempotent)
--    Drop if they already exist, then add.
-- -----------------------------------------
ALTER TABLE "Homework" DROP CONSTRAINT IF EXISTS "Homework_courseId_fkey";
ALTER TABLE "Note" DROP CONSTRAINT IF EXISTS "Note_courseId_fkey";

ALTER TABLE "Homework"
  ADD CONSTRAINT "Homework_courseId_fkey"
  FOREIGN KEY ("courseId")
  REFERENCES "courses"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

ALTER TABLE "Note"
  ADD CONSTRAINT "Note_courseId_fkey"
  FOREIGN KEY ("courseId")
  REFERENCES "courses"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;