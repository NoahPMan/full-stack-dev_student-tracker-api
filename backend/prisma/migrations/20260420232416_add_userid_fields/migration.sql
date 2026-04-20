-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "Homework_userId_idx" ON "Homework"("userId");

-- CreateIndex
CREATE INDEX "Homework_courseId_idx" ON "Homework"("courseId");

-- CreateIndex
CREATE INDEX "Homework_dueDate_idx" ON "Homework"("dueDate");

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- CreateIndex
CREATE INDEX "Note_courseId_idx" ON "Note"("courseId");

-- CreateIndex
CREATE INDEX "Note_pinned_idx" ON "Note"("pinned");
