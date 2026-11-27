import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

const rateLimit = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (limit && limit.count >= 5 && now < limit.reset) {
    return NextResponse.json({ ok: false, error: { code: "RATE_LIMIT", message: "Too many attempts" } }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      rateLimit.set(ip, { count: (limit?.count || 0) + 1, reset: now + 15 * 60 * 1000 });
      return NextResponse.json({ ok: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }, { status: 401 });
    }

    const token = await signToken({ email: user.email, id: user.id });
    const response = NextResponse.json({ ok: true, data: { email: user.email } });
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    rateLimit.delete(ip);
    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, error: { code: "VALIDATION", message: "Invalid input" } }, { status: 400 });
  }
}
