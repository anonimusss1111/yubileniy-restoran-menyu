import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@yubileniy.uz";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const categories = [
    { nameUz: "Nonushta", nameRu: "Завтрак", nameEn: "Breakfast", sortOrder: 1 },
    { nameUz: "Issiq taomlar", nameRu: "Горячие блюда", nameEn: "Hot dishes", sortOrder: 2 },
    { nameUz: "Salatlar", nameRu: "Салаты", nameEn: "Salads", sortOrder: 3 },
    { nameUz: "Desertlar", nameRu: "Десерты", nameEn: "Desserts", sortOrder: 4 },
    { nameUz: "Ichimliklar", nameRu: "Напитки", nameEn: "Drinks", sortOrder: 5 },
    { nameUz: "Non va pishiriqlar", nameRu: "Хлеб и выпечка", nameEn: "Bread & pastry", sortOrder: 6 },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const existing = await prisma.category.findFirst({ where: { nameUz: cat.nameUz } });
    if (existing) {
      catMap[cat.nameUz] = existing.id;
      await prisma.category.update({ where: { id: existing.id }, data: cat });
    } else {
      const created = await prisma.category.create({ data: cat });
      catMap[cat.nameUz] = created.id;
    }
  }

  const products = [
    { nameUz: "Osh", nameRu: "Плов", price: 52000, category: "Issiq taomlar", image: "/seed/osh.svg", weight: "400 g", calories: 650 },
    { nameUz: "Lag'mon", nameRu: "Лагман", price: 48000, category: "Issiq taomlar", image: "/seed/lagman.svg", weight: "450 g", calories: 580 },
    { nameUz: "Manti", nameRu: "Манты", price: 45000, category: "Issiq taomlar", image: "/seed/manti.svg", weight: "5 dona", calories: 420 },
    { nameUz: "Shashlik", nameRu: "Шашлык", price: 55000, category: "Issiq taomlar", image: "/seed/shashlik.svg", weight: "200 g", calories: 480, isAvailable: false },
    { nameUz: "Sezar salati", nameRu: "Салат Цезарь", price: 38000, category: "Salatlar", image: "/seed/caesar.svg", weight: "250 g", calories: 320 },
    { nameUz: "Napoleon", nameRu: "Наполеон", price: 32000, category: "Desertlar", image: "/seed/napoleon.svg", weight: "150 g", calories: 450 },
    { nameUz: "Kapuchino", nameRu: "Капучино", price: 28000, category: "Ichimliklar", image: "/seed/cappuccino.svg", weight: "250 ml", calories: 120 },
    { nameUz: "Non", nameRu: "Лепешка", price: 8000, category: "Non va pishiriqlar", image: "/seed/placeholder.svg", weight: "1 dona" },
    // Add more to reach 24+
    { nameUz: "Somsa", nameRu: "Самса", price: 15000, category: "Non va pishiriqlar", image: "/seed/placeholder.svg" },
    { nameUz: "Choy", nameRu: "Чай", price: 10000, category: "Ichimliklar", image: "/seed/placeholder.svg" },
    { nameUz: "Qahva", nameRu: "Кофе", price: 25000, category: "Ichimliklar", image: "/seed/placeholder.svg" },
    { nameUz: "Grechka", nameRu: "Гречка", price: 22000, category: "Issiq taomlar", image: "/seed/placeholder.svg" },
    { nameUz: "Tovuq qovurma", nameRu: "Жареная курица", price: 42000, category: "Issiq taomlar", image: "/seed/placeholder.svg" },
    { nameUz: "Baliq", nameRu: "Рыба", price: 60000, category: "Issiq taomlar", image: "/seed/placeholder.svg", isAvailable: false },
    { nameUz: "Olivye", nameRu: "Оливье", price: 28000, category: "Salatlar", image: "/seed/placeholder.svg" },
    { nameUz: "Vinaigret", nameRu: "Винегрет", price: 24000, category: "Salatlar", image: "/seed/placeholder.svg" },
    { nameUz: "Tiramisu", nameRu: "Тирамису", price: 35000, category: "Desertlar", image: "/seed/placeholder.svg" },
    { nameUz: "Cheesecake", nameRu: "Чизкейк", price: 34000, category: "Desertlar", image: "/seed/placeholder.svg" },
    { nameUz: "Tort", nameRu: "Торт", price: 30000, category: "Desertlar", image: "/seed/placeholder.svg" },
    { nameUz: "Suv", nameRu: "Вода", price: 5000, category: "Ichimliklar", image: "/seed/placeholder.svg" },
    { nameUz: "Sharbat", nameRu: "Компот", price: 12000, category: "Ichimliklar", image: "/seed/placeholder.svg" },
    { nameUz: "Nonushta to'plami", nameRu: "Завтрак сет", price: 40000, category: "Nonushta", image: "/seed/placeholder.svg" },
    { nameUz: "Omlet", nameRu: "Омлет", price: 22000, category: "Nonushta", image: "/seed/placeholder.svg" },
    { nameUz: "Blini", nameRu: "Блины", price: 18000, category: "Nonushta", image: "/seed/placeholder.svg" },
  ];

  for (const p of products) {
    const categoryId = catMap[p.category];
    if (!categoryId) continue;
    const existing = await prisma.product.findFirst({ where: { nameUz: p.nameUz } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { ...p, categoryId, isAvailable: p.isAvailable ?? true },
      });
    } else {
      await prisma.product.create({
        data: { ...p, categoryId, isAvailable: p.isAvailable ?? true },
      });
    }
  }

  const promos = [
    { titleUz: "Osh + Choy", titleRu: "Плов + Чай", badge: "-20%", imageUrl: "/seed/promo1.svg", sortOrder: 1 },
    { titleUz: "1+1 Desert", titleRu: "1+1 Десерт", badge: "1+1", imageUrl: "/seed/promo2.svg", sortOrder: 2 },
  ];

  for (const promo of promos) {
    const existing = await prisma.promotion.findFirst({ where: { titleUz: promo.titleUz } });
    if (!existing) {
      await prisma.promotion.create({ data: promo });
    }
  }

  const settings = [
    { key: "restaurantName", value: "Yubileniy Restoran" },
    { key: "logoUrl", value: "/seed/placeholder.svg" },
    { key: "stopListMode", value: "gray" },
    { key: "phone", value: "+998 90 123 45 67" },
    { key: "instagram", value: "@yubileniy" },
    { key: "wifi", value: "YubileniyGuest / 12345678" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
