export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";

async function loadLikes(userId: string): Promise<Product[]> {
  try {
    const likes = await db.like.findMany({
      where: { userId },
      include: { product: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });

    return likes.map(({ product: p }) => ({
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
  } catch {
    return [];
  }
}

export default async function LikesPage() {
  const currentUser = await getCurrentUser();
  const products = currentUser ? await loadLikes(currentUser.userId) : [];

  return (
    <div>
      <div className="px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold">관심목록</h1>
      </div>

      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">🤍</span>
          <p className="text-base font-medium">관심 상품이 없어요</p>
          <p className="text-sm mt-1">마음에 드는 상품에 관심을 표현해보세요</p>
        </div>
      )}
    </div>
  );
}
