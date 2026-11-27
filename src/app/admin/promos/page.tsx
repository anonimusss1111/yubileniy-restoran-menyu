"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PromosPage() {
  const { data, mutate, isLoading } = useSWR("/api/promos", fetcher);
  const promos = data?.data || [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titleUz: "", titleRu: "", badge: "", imageUrl: "", isActive: true });
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!json.ok) throw new Error();
      setForm((f) => ({ ...f, imageUrl: json.url }));
    } catch {
      toast.error("Rasm xatosi");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error("Rasm kerak");
      return;
    }
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message);
      toast.success("Yaratildi");
      setOpen(false);
      setForm({ titleUz: "", titleRu: "", badge: "", imageUrl: "", isActive: true });
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Xato");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("O‘chirish?")) return;
    try {
      const res = await fetch(`/api/promos/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error();
      toast.success("O‘chirildi");
      mutate();
    } catch {
      toast.error("Xato");
    }
  }

  if (isLoading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-muted hover:text-primary">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-serif text-2xl text-primary">Aksiyalar</h1>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={16} /> Yangi
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6 grid gap-4 sm:grid-cols-2">
        {promos.map((p: any) => (
          <div key={p.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
            <img src={p.imageUrl} alt="" className="w-full h-32 object-cover" />
            <div className="p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{p.titleUz}</div>
                {p.badge && <span className="text-xs text-primary">{p.badge}</span>}
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-muted hover:text-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="font-serif text-xl">Yangi aksiya</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Sarlavha (UZ) *</label>
              <input
                value={form.titleUz}
                onChange={(e) => setForm({ ...form, titleUz: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sarlavha (RU) *</label>
              <input
                value={form.titleRu}
                onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Badge (masalan -20%, 1+1)</label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Banner rasmi *</label>
              <input type="file" accept="image/*" onChange={handleImage} className="text-sm" />
            </div>
            {form.imageUrl && <img src={form.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl" />}
            {uploading && <p className="text-sm">Yuklanmoqda...</p>}
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
