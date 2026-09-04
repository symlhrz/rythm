import { NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(entries).where(eq(entries.id, Number(id)));
  return NextResponse.json({ ok: true });
}
