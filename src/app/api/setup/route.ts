import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

// Visit this URL once in your browser after deploying to create the
// database tables. It's safe to visit more than once — it won't
// overwrite or duplicate anything if the tables already exist.
export async function GET() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await db.execute(sql`
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS description TEXT
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS entries (
        id SERIAL PRIMARY KEY,
        activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        quantity DOUBLE PRECISION NOT NULL,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    return NextResponse.json({
      ok: true,
      message: "Database is set up! You can now use the app normally.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
