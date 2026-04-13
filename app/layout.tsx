import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "고구마마켓 - 우리 동네 중고거래",
  description: "당신 근처의 중고거래, 고구마마켓",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="max-w-2xl mx-auto min-h-screen">{children}</main>
      </body>
    </html>
  );
}
