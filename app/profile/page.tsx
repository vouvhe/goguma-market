export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProductCard from "@/components/ProductCard";
import type { Product, Profile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: products } = await supabase
    .from("products")
    .select("*, profiles(id, nickname, avatar_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Product[]>();

  return (
    <div>
      {/* 프로필 헤더 */}
      <div className="px-4 py-6 border-b border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-goguma-100 flex items-center justify-center text-3xl">
          🍠
        </div>
        <div>
          <h1 className="text-xl font-bold">{profile?.nickname ?? "고구마 유저"}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* 내 판매 상품 */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">판매 상품 ({products?.length ?? 0})</h2>
      </div>

      {products && products.length > 0 ? (
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
