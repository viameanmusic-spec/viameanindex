import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = () =>
  new TextEncoder().encode(process.env.AUTH_SECRET || "viamean-dev-secret-degistir");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth =
    pathname.startsWith("/admin/panel") ||
    (pathname.startsWith("/api/businesses") && req.method !== "GET") ||
    (pathname.startsWith("/api/team") && req.method !== "GET");

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("viamean_admin")?.value;
  try {
    if (!token) throw new Error("no token");
    await jwtVerify(token, secret());
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }
}

export const config = {
  matcher: ["/admin/panel/:path*", "/api/businesses/:path*", "/api/team/:path*"],
};
