"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();

  useEffect(() => {
    alert("DB 무료 사용일자 초과");
    router.back();
  }, [router]);

  return (
    <div className="flex items-center justify-center py-24 text-gray-400">
      불러오는 중...
    </div>
  );
}
