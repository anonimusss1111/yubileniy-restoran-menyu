import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  titleUz: z.string().min(1),
  titleRu: z.string().min(1),
  titleEn: z.string().optional(),
  subtitleUz: z.string().optional(),
  subtitleRu: z.string().optional(),
  subtitleEn: z.string().optional(),
  badge: z.string().optional(),
  imageUrl: z.string().min(1),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const promos = await prisma.promotion.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ ok: true, data: promos });
  } catch {
    return NextResponse.json({ ok: false, error: { message: "Failed" } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const promo = await prisma.promotion.create({ data });
    return NextResponse.json({ ok: true, data: promo });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Invalid" } }, { status: 400 });
  }
}
