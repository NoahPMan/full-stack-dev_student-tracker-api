import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

// Create a pg Pool using your DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create the Prisma Postgres adapter from that pool
const adapter = new PrismaPg(pool);

// Single PrismaClient instance (safe with dev HMR)
export const prisma =
    global.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    global.__prisma = prisma;
}