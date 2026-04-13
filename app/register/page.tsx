"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Supabase Auth 회원가입 (nickname을 metadata로 전달 → 트리거가 profiles에 자동 저장)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("이미 사용 중인 이메일입니다.");
      } else {
        setError(signUpError.message ?? "회원가입에 실패했습니다.");
      }
      setLoading(false);
      return;
    }

    // 이메일 인증이 필요한 경우 (session이 없음)
    if (!data.session) {
      setError("📧 가입 확인 이메일을 보냈습니다. 이메일을 확인한 뒤 로그인해 주세요.");
      setLoading(false);
      return;
    }

    // 이메일 인증 불필요한 경우 → 바로 홈으로
    router.push("/");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🍠</span>
          <h1 className="mt-2 text-2xl font-bold text-goguma-600">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">고구마마켓에 오신 걸 환영해요!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="동네 이웃에게 보여질 이름"
              minLength={2}
              maxLength={10}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-goguma-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="goguma@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-goguma-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="6자 이상"
              minLength={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-goguma-400"
            />
          </div>

          {error && (
            <p className={`text-sm text-center ${error.startsWith("📧") ? "text-blue-500" : "text-red-500"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-goguma-500 text-white py-3 rounded-xl font-medium hover:bg-goguma-600 transition disabled:opacity-50"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-goguma-600 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
