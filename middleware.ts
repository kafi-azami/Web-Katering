import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // If trying to access dashboard without token → redirect to login
  if (isDashboard && token !== secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If already logged in and trying to access login page → redirect to dashboard
  if (isLoginPage && token === secret) {
    return NextResponse.redirect(new URL("/dashboard/menu", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};