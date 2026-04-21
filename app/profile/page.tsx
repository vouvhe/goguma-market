export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const user = await db.user.findUnique({ where: { id: currentUser.userId } });

  const rows = await db.product.findMany({
    where: { userId: currentUser.userId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const products: Product[] = rows.map((p) => ({
    id: p.id,
    user_id: p.userId,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category as Category | null,
    image_urls: JSON.parse(p.imageUrls) as string[],
    status: p.status as Product["status"],
    created_at: p.createdAt.toISOString(),
    profiles: {
      id: p.user.id,
      nickname: p.user.nickname,
      avatar_url: p.user.avatarUrl ?? null,
      created_at: p.user.createdAt.toISOString(),
    },
  }));

  return (
    <div>
      <div className="px-4 py-6 border-b border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-goguma-100 flex items-center justify-center text-3xl">
          🍠
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.nickname ?? "고구마 유저"}</h1>
          <p className="text-sm text-gray-400">{currentUser.email}</p>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">판매 상품 ({products.length})</h2>
      </div>

      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">🍠</span>
          <p className="text-base font-medium">아직 판매 중인 상품이 없어요</p>
        </div>
      )}
    </div>
  );
}
