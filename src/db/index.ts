import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Vercel Postgres / Neon integrations set POSTGRES_URL automatically.
// Falls back to DATABASE_URL for other providers.
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "No database connection string found. Set POSTGRES_URL or DATABASE_URL in your environment."
  );
}

// Reuse the pool across hot reloads / serverless invocations in the same instance.
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const pool =
  global._pgPool ??
  new Pool({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export const db = drizzle(pool, { schema });
