"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminMenuPage() {
  const { data: productsData, mutate: mutateProducts, isLoading } = useSWR("/api/products", fetcher);
  const { data: catsData } = useSWR("/api/categories", fetcher);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const products = (productsData?.data || []).filter((p: any) => {
    if (categoryFilter && p.categoryId !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.nameUz.toLowerCase().includes(q) || p.nameRu.toLowerCase().includes(q);
    }
    return true;
  });
  const categories = catsData?.data || [];

  async function toggleAvailable(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error();
      toast.success(!current ? "Sotuvda" : "Stop-list");
      mutateProducts();
    } catch {
      toast.error("Xato");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("O‘chirish?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error();
      toast.success("O‘chirildi");
      mutateProducts();
    } catch {
      toast.error("Xato");
    }
  }

  if (isLoading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-muted hover:text-primary">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-serif text-2xl text-primary">Menyu</h1>
          </div>
          <Link
            href="/admin/menu/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium"
          >
            <Plus size={16} /> Yangi taom
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-4 flex gap-3">
        <input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-border rounded-xl px-3 py-2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-border rounded-xl px-3 py-2 text-sm"
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.nameUz}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-8 space-y-2">
        {products.map((p: any) => (
          <div key={p.id} className="bg-surface border border-border rounded-2xl p-3 flex items-center gap-3">
            <img
              src={p.imageUrl || "/seed/placeholder.svg"}
              alt=""
              className="w-14 h-14 rounded-xl object-cover bg-background-alt"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.nameUz}</div>
              <div className="text-xs text-muted">{p.category?.nameUz} · {p.price.toLocaleString()} so‘m</div>
            </div>
            <button
              onClick={() => toggleAvailable(p.id, p.isAvailable)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                p.isAvailable ? "bg-success/10 text-success" : "bg-danger-soft text-danger"
              }`}
            >
              {p.isAvailable ? "Sotuvda" : "Stop"}
            </button>
            <Link
              href={`/admin/menu/${p.id}`}
              className="p-2 text-muted hover:text-primary"
              aria-label="Tahrirlash"
            >
              <Pencil size={16} />
            </Link>
            <button onClick={() => handleDelete(p.id)} className="p-2 text-muted hover:text-danger">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {products.length === 0 && <p className="text-center text-muted py-10">Mahsulot yo‘q</p>}
      </div>
    </div>
  );
}
