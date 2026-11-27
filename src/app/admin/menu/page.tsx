import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function AdminMenu() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { products: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-[#8B5E34]">Menyu</h1>
          <Link href="/admin" className="text-sm text-[#6E6A63]">← Orqaga</Link>
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="mb-6 bg-white rounded-2xl p-4 border border-[#EFECE6]">
            <h2 className="font-medium mb-3">{cat.nameUz}</h2>
            <div className="space-y-2">
              {cat.products.map((p) => (
                <div key={p.id} className="flex justify-between text-sm py-2 border-b border-[#EFECE6] last:border-0">
                  <span>{p.nameUz}</span>
                  <span className="text-[#8B5E34]">{p.price.toLocaleString()} so‘m</span>
                </div>
              ))}
              {cat.products.length === 0 && <p className="text-sm text-[#6E6A63]">Mahsulot yo‘q</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
