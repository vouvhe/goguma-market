export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabase-server";
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

export default async function HomePage({ searchParams }: HomeProps) {
  const { category } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("products")
    .select("*, profiles(id, nickname, avatar_url)")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products } = await query.returns<Product[]>();

  return (
    <div>
      {/* 카테고리 필터 */}
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

      {/* 상품 목록 */}
      {products && products.length > 0 ? (
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
