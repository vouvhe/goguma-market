"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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
  const supabase = createClient();

  async function toggle() {
    if (!userId) {
      router.push("/login");
      return;
    }
    setLoading(true);

    if (isLiked) {
      await supabase.from("likes").delete().eq("product_id", productId).eq("user_id", userId);
      setIsLiked(false);
      setCount((c) => c - 1);
    } else {
      await supabase.from("likes").insert({ product_id: productId, user_id: userId });
      setIsLiked(true);
      setCount((c) => c + 1);
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
