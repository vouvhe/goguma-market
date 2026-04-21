export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";

const CATEGORIES: Category[] = [
  "디지털/가전",
  "가구/인테리어",
  "의류",
  "도서",
  "스포츠/레저",
  "뷰티/미용",
  "생활/주방",
  "기타",
];

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

async function loadProducts(category?: string): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({
      where: category ? { category } : undefined,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((p) => ({
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

export default async function HomePage({ searchParams }: HomeProps) {
  const { category } = await searchParams;
  const products = await loadProducts(category);

  return (
    <div>
      <div className="overflow-x-auto px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2 min-w-max">
          <a
            href="/"
            className={`px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap ${
              !category
                ? "bg-goguma-500 text-white border-goguma-500"
                : "border-gray-300 text-gray-600 hover:border-goguma-400"
            }`}
          >
            전체
          </a>
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap ${
                category === cat
                  ? "bg-goguma-500 text-white border-goguma-500"
                  : "border-gray-300 text-gray-600 hover:border-goguma-400"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <div>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">🍠</span>
          <p className="text-base font-medium">아직 등록된 상품이 없어요</p>
          <p className="text-sm mt-1">첫 번째 판매자가 되어보세요!</p>
        </div>
      )}
    </div>
  );
}
