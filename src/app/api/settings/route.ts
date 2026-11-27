import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json({ ok: true, data: map });
  } catch {
    return NextResponse.json({ ok: false, error: { message: "Failed" } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Failed" } }, { status: 400 });
  }
}
