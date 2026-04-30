/*
  Warnings:

  - A unique constraint covering the columns `[userId,code]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Homework` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "courses_code_key";

-- AlterTable
ALTER TABLE "Homework" ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "credits" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "courses_userId_idx" ON "courses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_userId_code_key" ON "courses"("userId", "code");

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
