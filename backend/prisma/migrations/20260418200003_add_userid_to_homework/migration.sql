-- Add Clerk user ID to homework for user-scoped queries.
-- Stores the Clerk userId string directly (no local User table).
ALTER TABLE "Homework" ADD COLUMN "userId" TEXT;
