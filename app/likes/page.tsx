export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

export default async function LikesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: likes } = await supabase
    .from("likes")
    .select("products(*, profiles(id, nickname, avatar_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: Product[] = (likes ?? [])
    .map((l: any) => l.products as Product | null)
    .filter(Boolean) as Product[];

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
