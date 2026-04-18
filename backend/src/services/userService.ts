import { prisma } from '../db/prisma';

/**
 * Looks up the local User record for a given Clerk user ID,
 * creating it on first sign-in if it doesn't exist yet.
 */
export async function getOrCreateUser(clerkId: string) {
  return prisma.user.upsert({
    where:  { clerkId },
    update: {},
    create: { clerkId },
  });
}
