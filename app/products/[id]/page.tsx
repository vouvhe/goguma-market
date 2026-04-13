export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Product } from "@/types";
import LikeButton from "./LikeButton";
import ImageGallery from "./ImageGallery";
import OwnerActions from "./OwnerActions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, profiles(id, nickname, avatar_url)")
    .eq("id", id)
    .single<Product>();

  if (!product) notFound();

  // 현재 로그인 유저
  const { data: { user } } = await supabase.auth.getUser();

  // 관심 여부
  let isLiked = false;
  let likeCount = 0;

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("product_id", id);
  likeCount = count ?? 0;

  if (user) {
    const { data: like } = await supabase
      .from("likes")
      .select("id")
      .eq("product_id", id)
      .eq("user_id", user.id)
      .single();
    isLiked = !!like;
  }

  const STATUS_LABEL: Record<string, string> = {
    selling: "판매중",
    reserved: "예약중",
    sold: "거래완료",
  };

  return (
    <div className="pb-24">
      {/* 이미지 갤러리 */}
      <ImageGallery images={product.image_urls ?? []} title={product.title} />

      {/* 판매자 정보 */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-goguma-100 flex items-center justify-center text-xl">
            🍠
          </div>
          <p className="font-medium text-sm">{product.profiles?.nickname ?? "알 수 없음"}</p>
        </div>
        {/* 본인 상품일 때만 수정/삭제/상태변경 표시 */}
        {user && user.id === product.user_id && (
          <OwnerActions productId={id} currentStatus={product.status} />
        )}
      </div>

      {/* 상품 정보 */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            product.status === "selling"
              ? "bg-goguma-100 text-goguma-700"
              : "bg-gray-100 text-gray-500"
          }`}>
            {STATUS_LABEL[product.status]}
          </span>
          {product.category && (
            <span className="text-xs text-gray-400">{product.category}</span>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          {new Date(product.created_at).toLocaleDateString("ko-KR")}
        </p>
        {product.description && (
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        )}
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-4 max-w-2xl mx-auto">
        <LikeButton
          productId={id}
          isLiked={isLiked}
          likeCount={likeCount}
          userId={user?.id}
        />
        <div className="flex-1">
          <p className="font-bold text-lg">{product.price.toLocaleString()}원</p>
        </div>
        {user && user.id !== product.user_id && (
          <button className="bg-goguma-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-goguma-600 transition">
            채팅하기
          </button>
        )}
      </div>
    </div>
  );
}
