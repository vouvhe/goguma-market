import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { Category } from "@/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, include: { user: true } });
  if (!product) return NextResponse.json(null, { status: 404 });

  return NextResponse.json({
    id: product.id,
    user_id: product.userId,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category as Category | null,
    image_urls: JSON.parse(product.imageUrls) as string[],
    status: product.status,
    created_at: product.createdAt.toISOString(),
    profiles: {
      id: product.user.id,
      nickname: product.user.nickname,
      avatar_url: product.user.avatarUrl ?? null,
      created_at: product.user.createdAt.toISOString(),
    },
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product || product.userId !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, price, category, imageUrls } = await request.json();
  await db.product.update({
    where: { id },
    data: { title, description, price, category, imageUrls: JSON.stringify(imageUrls ?? []) },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product || product.userId !== user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
