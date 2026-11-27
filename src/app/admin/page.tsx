import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-primary mb-8">Admin Panel</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/admin/menu" className="bg-surface p-6 rounded-2xl shadow-soft text-center hover:shadow-lg transition">
            Menyu
          </Link>
          <Link href="/admin/categories" className="bg-surface p-6 rounded-2xl shadow-soft text-center">
            Kategoriyalar
          </Link>
          <Link href="/admin/promos" className="bg-surface p-6 rounded-2xl shadow-soft text-center">
            Aksiyalar
          </Link>
          <Link href="/admin/qr" className="bg-surface p-6 rounded-2xl shadow-soft text-center">
            QR
          </Link>
          <Link href="/admin/settings" className="bg-surface p-6 rounded-2xl shadow-soft text-center">
            Sozlamalar
          </Link>
        </div>
      </div>
    </div>
  );
}
