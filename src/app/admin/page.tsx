import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const links = [
    { href: "/admin/menu", label: "Menyu" },
    { href: "/admin/categories", label: "Kategoriyalar" },
    { href: "/admin/promos", label: "Aksiyalar" },
    { href: "/admin/qr", label: "QR kodlar" },
    { href: "/admin/settings", label: "Sozlamalar" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-[#8B5E34]">Admin Panel</h1>
          <form action="/api/auth/logout" method="POST">
            <button className="text-sm text-[#6E6A63] hover:text-[#B3402F]">Chiqish</button>
          </form>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-white p-6 rounded-2xl shadow-sm border border-[#EFECE6] text-center hover:shadow-md transition-shadow"
            >
              <span className="font-medium">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
