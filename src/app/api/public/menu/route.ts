import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stopListMode = (await prisma.setting.findUnique({ where: { key: "stopListMode" } }))?.value || "gray";

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: stopListMode === "hide" ? { isAvailable: true } : {},
          orderBy: [{ isAvailable: "desc" }, { sortOrder: "asc" }],
        },
      },
    });

    const promos = await prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const settings = await prisma.setting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    return NextResponse.json({
      ok: true,
      data: { categories, promos, settings: settingsMap, stopListMode },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to load menu" } }, { status: 500 });
  }
}
