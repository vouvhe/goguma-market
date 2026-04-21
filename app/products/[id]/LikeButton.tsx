"use client";

import { useState } from "react";

interface LikeButtonProps {
  productId: string;
  isLiked: boolean;
  likeCount: number;
  userId?: string;
}

export default function LikeButton({ isLiked: initialLiked, likeCount }: LikeButtonProps) {
  const [isLiked] = useState(initialLiked);

  function toggle() {
    alert("DB 무료 사용일자 초과");
  }

  return (
    <button
      onClick={toggle}
      className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-goguma-500 transition"
    >
      <span className={`text-2xl ${isLiked ? "text-goguma-500" : ""}`}>
        {isLiked ? "🧡" : "🤍"}
      </span>
      <span className="text-xs">{likeCount}</span>
    </button>
  );
}
