import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, price, category, imageUrls } = await request.json();

  const product = await db.product.create({
    data: {
      userId: user.userId,
      title,
      description,
      price,
      category,
      imageUrls: JSON.stringify(imageUrls ?? []),
    },
  });

  return NextResponse.json({ id: product.id });
}
