import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nameUz: z.string().min(1),
  nameRu: z.string().min(1),
  nameEn: z.string().optional(),
  descriptionUz: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().int().min(0),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  weight: z.string().optional(),
  calories: z.number().int().optional(),
  isAvailable: z.boolean().default(true),
  categoryId: z.string(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const available = searchParams.get("available");

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (available === "true") where.isAvailable = true;
    if (available === "false") where.isAvailable = false;
    if (search) {
      where.OR = [
        { nameUz: { contains: search } },
        { nameRu: { contains: search } },
        { nameEn: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true },
    });
    return NextResponse.json({ ok: true, data: products });
  } catch {
    return NextResponse.json({ ok: false, error: { message: "Failed" } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const product = await prisma.product.create({ data });
    return NextResponse.json({ ok: true, data: product });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Invalid" } }, { status: 400 });
  }
}
