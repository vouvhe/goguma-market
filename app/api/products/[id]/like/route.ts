import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: productId } = await params;

  const existing = await db.like.findUnique({
    where: { userId_productId: { userId: user.userId, productId } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  } else {
    await db.like.create({ data: { userId: user.userId, productId } });
    return NextResponse.json({ liked: true });
  }
}
