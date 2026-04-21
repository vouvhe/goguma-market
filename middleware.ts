import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/products/new", "/likes", "/profile"];
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "goguma-market-secret-key-2026"
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
