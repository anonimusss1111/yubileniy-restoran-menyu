import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nameUz: z.string().min(1).optional(),
  nameRu: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  descriptionUz: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().int().min(0).optional(),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  weight: z.string().optional(),
  calories: z.number().int().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = schema.parse(body);
    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: product });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Failed" } }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Failed" } }, { status: 400 });
  }
}
