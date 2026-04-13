import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const STATUS_LABEL: Record<string, string> = {
  reserved: "예약중",
  sold: "거래완료",
};

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.image_urls?.[0];

  return (
    <Link href={`/products/${product.id}`}>
      <div className="flex gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 px-4 transition">
        {/* 썸네일 */}
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 relative">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🍠
            </div>
          )}
          {product.status !== "selling" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {STATUS_LABEL[product.status]}
              </span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{product.title}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {product.profiles?.nickname ?? "알 수 없음"}
          </p>
          <p className="font-bold text-gray-900 mt-1">
            {product.price.toLocaleString()}원
          </p>
        </div>
      </div>
    </Link>
  );
}
