"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function NewProductPage() {
  const router = useRouter();
  const { data: catsData } = useSWR("/api/categories", fetcher);
  const categories = catsData?.data || [];

  const [form, setForm] = useState({
    nameUz: "",
    nameRu: "",
    nameEn: "",
    descriptionUz: "",
    descriptionRu: "",
    price: 0,
    categoryId: "",
    brand: "",
    weight: "",
    calories: "",
    imageUrl: "",
    isAvailable: true,
  });
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
      if (!json.ok) throw new Error(json.error?.message || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: json.url }));
      toast.success("Rasm yuklandi");
    } catch (err: any) {
      toast.error(err.message || "Rasm xatosi");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.categoryId) {
      toast.error("Kategoriya tanlang");
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          calories: form.calories ? Number(form.calories) : undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Xato");
      toast.success("Yaratildi");
      router.push("/admin/menu");
    } catch (err: any) {
      toast.error(err.message || "Xato");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/admin/menu" className="text-muted hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-2xl text-primary">Yangi taom</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nomi (UZ)*"
            value={form.nameUz}
            onChange={(e) => setForm({ ...form, nameUz: e.target.value })}
            className="border border-border rounded-xl px-3 py-2"
            required
          />
          <input
            placeholder="Nomi (RU)*"
            value={form.nameRu}
            onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
            className="border border-border rounded-xl px-3 py-2"
            required
          />
        </div>
        <input
          placeholder="Nomi (EN)"
          value={form.nameEn}
          onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
          className="w-full border border-border rounded-xl px-3 py-2"
        />
        <textarea
          placeholder="Tavsif (UZ)"
          value={form.descriptionUz}
          onChange={(e) => setForm({ ...form, descriptionUz: e.target.value })}
          className="w-full border border-border rounded-xl px-3 py-2 h-20"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Narx*"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="border border-border rounded-xl px-3 py-2"
            required
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="border border-border rounded-xl px-3 py-2"
            required
          >
            <option value="">Kategoriya</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.nameUz}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="Brend"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="border border-border rounded-xl px-3 py-2"
          />
          <input
            placeholder="Og‘irlik"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="border border-border rounded-xl px-3 py-2"
          />
          <input
            type="number"
            placeholder="Kaloriya"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            className="border border-border rounded-xl px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Rasm</label>
          <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="" className="mt-2 w-32 h-32 object-cover rounded-xl" />
          )}
          {uploading && <p className="text-sm text-muted">Yuklanmoqda...</p>}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
          />
          Sotuvda
        </label>

        <div className="flex gap-2 justify-end pt-4">
          <Link href="/admin/menu" className="px-4 py-2 text-sm">
            Bekor
          </Link>
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm">
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
}
