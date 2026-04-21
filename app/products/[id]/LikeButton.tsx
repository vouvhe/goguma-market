"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  productId: string;
  isLiked: boolean;
  likeCount: number;
  userId?: string;
}

export default function LikeButton({ productId, isLiked: initialLiked, likeCount: initialCount, userId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (!userId) {
      router.push("/login");
      return;
    }
    setLoading(true);

    const res = await fetch(`/api/products/${productId}/like`, { method: "POST" });
    if (res.ok) {
      const { liked } = await res.json();
      setIsLiked(liked);
      setCount((c) => c + (liked ? 1 : -1));
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-goguma-500 transition disabled:opacity-50"
    >
      <span className={`text-2xl ${isLiked ? "text-goguma-500" : ""}`}>
        {isLiked ? "🧡" : "🤍"}
      </span>
      <span className="text-xs">{count}</span>
    </button>
  );
}
