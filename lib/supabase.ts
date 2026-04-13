import { createBrowserClient } from "@supabase/ssr";

// 브라우저(클라이언트 컴포넌트)에서 사용
export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key";
  return createBrowserClient(url, key);
}
