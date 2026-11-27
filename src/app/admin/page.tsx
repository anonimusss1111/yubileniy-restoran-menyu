import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const links = [
    { href: "/admin/menu", label: "Menyu", desc: "Mahsulotlar va kategoriyalar" },
    { href: "/admin/categories", label: "Kategoriyalar", desc: "Bo‘limlarni boshqarish" },
    { href: "/admin/promos", label: "Aksiyalar", desc: "Promo va chegirmalar" },
    { href: "/admin/qr", label: "QR kodlar", desc: "Stol QR kodlari" },
    { href: "/admin/settings", label: "Sozlamalar", desc: "Restoran sozlamalari" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="bg-white border-b border-[#EFECE6]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-[#8B5E34]">Admin Panel</h1>
          <form action="/api/auth/logout" method="POST">
            <button className="text-sm text-[#6E6A63] hover:text-[#B3402F] transition">Chiqish</button>
          </form>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(139,94,52,0.06)] border border-[#EFECE6] hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="font-medium text-lg text-[#1F1F1F]">{l.label}</div>
              <div className="text-sm text-[#6E6A63] mt-1">{l.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
