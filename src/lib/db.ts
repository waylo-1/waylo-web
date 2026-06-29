import { Pool } from 'pg';

// Reuse pool across serverless invocations (Next.js caches module-level vars)
const globalForPg = globalThis as unknown as { pool: Pool | undefined };

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Aurora
    max: 5,
  });

globalForPg.pool = pool;
