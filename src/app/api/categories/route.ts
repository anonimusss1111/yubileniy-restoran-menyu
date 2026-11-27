import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nameUz: z.string().min(1),
  nameRu: z.string().min(1),
  nameEn: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ ok: true, data: categories });
  } catch {
    return NextResponse.json({ ok: false, error: { message: "Failed" } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const category = await prisma.category.create({
      data: { ...data, sortOrder: (maxOrder._max.sortOrder ?? 0) + 1 },
    });
    return NextResponse.json({ ok: true, data: category });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Invalid" } }, { status: 400 });
  }
}
