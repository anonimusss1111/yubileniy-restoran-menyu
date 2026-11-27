"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Category = {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
};

export default function CategoriesPage() {
  const { data, error, mutate, isLoading } = useSWR("/api/categories", fetcher);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ nameUz: "", nameRu: "", nameEn: "", isActive: true });
  const [open, setOpen] = useState(false);

  const categories: Category[] = data?.data || [];

  function openNew() {
    setEditing(null);
    setForm({ nameUz: "", nameRu: "", nameEn: "", isActive: true });
    setOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({
      nameUz: cat.nameUz,
      nameRu: cat.nameRu,
      nameEn: cat.nameEn || "",
      isActive: cat.isActive,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Xato");
      toast.success(editing ? "Yangilandi" : "Yaratildi");
      setOpen(false);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Xato yuz berdi");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("O‘chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Xato");
      toast.success("O‘chirildi");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "O‘chirib bo‘lmadi");
    }
  }

  if (isLoading) return <div className="p-8 text-center">Yuklanmoqda...</div>;
  if (error) return <div className="p-8 text-center text-danger">Xato</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-muted hover:text-primary">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-serif text-2xl text-primary">Kategoriyalar</h1>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium"
          >
            <Plus size={16} /> Yangi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{cat.nameUz}</div>
              <div className="text-sm text-muted">{cat.nameRu}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(cat)} className="p-2 text-muted hover:text-primary">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 text-muted hover:text-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-center text-muted py-10">Kategoriya yo‘q</p>}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-serif text-xl">{editing ? "Tahrirlash" : "Yangi kategoriya"}</h2>
            <input
              placeholder="Nomi (UZ)"
              value={form.nameUz}
              onChange={(e) => setForm({ ...form, nameUz: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
              required
            />
            <input
              placeholder="Nomi (RU)"
              value={form.nameRu}
              onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
              required
            />
            <input
              placeholder="Nomi (EN)"
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Faol
            </label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm">
                Bekor
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm">
                Saqlash
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
