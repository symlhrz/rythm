import { NextResponse } from "next/server";
import { db } from "@/db";
import { entries, activities } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const all = await db
    .select({
      id: entries.id,
      date: entries.date,
      quantity: entries.quantity,
      notes: entries.notes,
      activityId: entries.activityId,
      activityName: activities.name,
      activityUnit: activities.unit,
    })
    .from(entries)
    .innerJoin(activities, eq(entries.activityId, activities.id))
    .orderBy(desc(entries.date), desc(entries.id));

  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { activityId, date, quantity, notes } = body;

  if (!activityId || !date || quantity === undefined || quantity === null) {
    return NextResponse.json(
      { error: "activityId, date, and quantity are required" },
      { status: 400 }
    );
  }

  const parsedQuantity = Number(quantity);
  if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
    return NextResponse.json(
      { error: "quantity must be a positive number" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(entries)
    .values({
      activityId: Number(activityId),
      date,
      quantity: parsedQuantity,
      notes: notes?.trim() || null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
