import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_COLOR = "#171717";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const [updated] = await db
    .update(activities)
    .set({
      name,
      unit,
      description: description || null,
      color: HEX_COLOR.test(color) ? color : DEFAULT_COLOR,
    })
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
