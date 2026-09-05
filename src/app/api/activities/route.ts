import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { asc } from "drizzle-orm";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_COLOR = "#171717";

export async function GET() {
  const all = await db.select().from(activities).orderBy(asc(activities.name));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body.name ?? "").trim();
  const unit = (body.unit ?? "").trim();
  const description = (body.description ?? "").trim();
  const color = (body.color ?? "").trim();

  if (!name || !unit) {
    return NextResponse.json(
      { error: "Name and unit are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(activities)
    .values({
      name,
      unit,
      description: description || null,
      color: HEX_COLOR.test(color) ? color : DEFAULT_COLOR,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
