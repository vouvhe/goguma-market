"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CurrentUser } from "@/types";

export default function Header() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl">🍠</span>
          <span className="font-bold text-goguma-600 text-lg">고구마마켓</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/products/new"
                className="text-sm font-medium text-goguma-600 hover:text-goguma-700"
              >
                판매하기
              </Link>
              <Link
                href="/likes"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                관심목록
              </Link>
              <Link
                href="/profile"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                나의당근
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-goguma-600 hover:text-goguma-700"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="text-sm bg-goguma-500 text-white px-3 py-1.5 rounded-full hover:bg-goguma-600 transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
