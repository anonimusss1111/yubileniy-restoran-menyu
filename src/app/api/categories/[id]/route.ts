import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nameUz: z.string().min(1).optional(),
  nameRu: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = schema.parse(body);
    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json({ ok: true, data: category });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Failed" } }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json(
        { ok: false, error: { message: `Bu kategoriyada ${count} ta mahsulot bor. Avval ularni o‘chiring.` } },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Failed" } }, { status: 400 });
  }
}
