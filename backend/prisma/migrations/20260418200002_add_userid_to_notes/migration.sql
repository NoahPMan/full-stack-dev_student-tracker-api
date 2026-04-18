-- Add Clerk user ID to notes for user-scoped queries.
-- Stores the Clerk userId string directly (no local User table).
ALTER TABLE "Note" ADD COLUMN "userId" TEXT;
