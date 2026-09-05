import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const [updated] = await db
    .update(activities)
    .set({ name, unit, description: description || null })
    .where(eq(activities.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(activities).where(eq(activities.id, Number(id)));
  return NextResponse.json({ ok: true });
}
