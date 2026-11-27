import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdmin = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isMutatingApi = pathname.startsWith("/api/") && request.method !== "GET" && !pathname.startsWith("/api/auth") && !pathname.startsWith("/api/public") && !pathname.startsWith("/api/waiter-call");

  if (isAdmin || isMutatingApi) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Invalid token" } }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
