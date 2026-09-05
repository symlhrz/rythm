import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(activities).orderBy(asc(activities.name));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body.name ?? "").trim();
  const unit = (body.unit ?? "").trim();
  const description = (body.description ?? "").trim();

  if (!name || !unit) {
    return NextResponse.json(
      { error: "Name and unit are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(activities)
    .values({ name, unit, description: description || null })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
