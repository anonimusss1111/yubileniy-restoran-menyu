import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "AdminUser" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Category" ("id" TEXT NOT NULL PRIMARY KEY, "nameUz" TEXT NOT NULL, "nameRu" TEXT NOT NULL, "nameEn" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Product" ("id" TEXT NOT NULL PRIMARY KEY, "nameUz" TEXT NOT NULL, "nameRu" TEXT NOT NULL, "nameEn" TEXT, "descriptionUz" TEXT, "descriptionRu" TEXT, "descriptionEn" TEXT, "price" INTEGER NOT NULL, "imageUrl" TEXT, "brand" TEXT, "weight" TEXT, "calories" INTEGER, "isAvailable" BOOLEAN NOT NULL DEFAULT true, "sortOrder" INTEGER NOT NULL DEFAULT 0, "categoryId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Promotion" ("id" TEXT NOT NULL PRIMARY KEY, "titleUz" TEXT NOT NULL, "titleRu" TEXT NOT NULL, "titleEn" TEXT, "subtitleUz" TEXT, "subtitleRu" TEXT, "subtitleEn" TEXT, "badge" TEXT, "imageUrl" TEXT NOT NULL, "isActive" BOOLEAN NOT NULL DEFAULT true, "sortOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Setting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "WaiterCall" ("id" TEXT NOT NULL PRIMARY KEY, "table" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "isDone" BOOLEAN NOT NULL DEFAULT false)`);

    const hash = await hashPassword("771997111");
    await prisma.adminUser.upsert({
      where: { email: "olim" },
      update: { passwordHash: hash },
      create: { email: "olim", passwordHash: hash },
    });

    const cat = await prisma.category.upsert({
      where: { id: "seed-cat-1" },
      update: {},
      create: { id: "seed-cat-1", nameUz: "Issiq taomlar", nameRu: "Горячие блюда", sortOrder: 1 },
    });

    await prisma.product.upsert({
      where: { id: "seed-prod-1" },
      update: {},
      create: {
        id: "seed-prod-1",
        nameUz: "Osh",
        nameRu: "Плов",
        price: 52000,
        categoryId: cat.id,
        isAvailable: true,
      },
    });

    return NextResponse.json({ ok: true, message: "Tables created, admin olim created" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
