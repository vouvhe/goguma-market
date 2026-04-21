export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { Category } from "@/types";
import LikeButton from "./LikeButton";
import ImageGallery from "./ImageGallery";
import OwnerActions from "./OwnerActions";

interface Props {
  params: Promise<{ id: string }>;
}

async function loadProduct(id: string) {
  try {
    const p = await db.product.findUnique({ where: { id }, include: { user: true } });
    if (!p) return null;

    return {
      id: p.id,
      user_id: p.userId,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category as Category | null,
      image_urls: JSON.parse(p.imageUrls) as string[],
      status: p.status as "selling" | "reserved" | "sold",
      created_at: p.createdAt.toISOString(),
      profiles: {
        id: p.user.id,
        nickname: p.user.nickname,
        avatar_url: p.user.avatarUrl ?? null,
      },
    };
  } catch {
    return null;
  }
}

async function loadLikeInfo(id: string, userId?: string) {
  try {
    const likeCount = await db.like.count({ where: { productId: id } });
    let isLiked = false;
    if (userId) {
      const like = await db.like.findUnique({
        where: { userId_productId: { userId, productId: id } },
      });
      isLiked = !!like;
    }
    return { likeCount, isLiked };
  } catch {
    return { likeCount: 0, isLiked: false };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = await loadProduct(id);
  if (!product) notFound();

  const currentUser = await getCurrentUser();
  const { likeCount, isLiked } = await loadLikeInfo(id, currentUser?.userId);

  const STATUS_LABEL: Record<string, string> = {
    selling: "판매중",
    reserved: "예약중",
    sold: "거래완료",
  };

  return (
    <div className="pb-24">
      <ImageGallery images={product.image_urls} title={product.title} />

      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-goguma-100 flex items-center justify-center text-xl">
            🍠
          </div>
          <p className="font-medium text-sm">{product.profiles.nickname}</p>
        </div>
        {currentUser && currentUser.userId === product.user_id && (
          <OwnerActions productId={id} currentStatus={product.status} />
        )}
      </div>

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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-4 max-w-2xl mx-auto">
        <LikeButton
          productId={id}
          isLiked={isLiked}
          likeCount={likeCount}
          userId={currentUser?.userId}
        />
        <div className="flex-1">
          <p className="font-bold text-lg">{product.price.toLocaleString()}원</p>
        </div>
        {currentUser && currentUser.userId !== product.user_id && (
          <button className="bg-goguma-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-goguma-600 transition">
            채팅하기
          </button>
        )}
      </div>
    </div>
  );
}
