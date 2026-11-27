"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { data: catsData } = useSWR("/api/categories", fetcher);
  const { data: productData } = useSWR(productId ? `/api/products/${productId}` : null, fetcher);
  const categories = catsData?.data || [];

  const existing = productData?.data;

  const [form, setForm] = useState({
    nameUz: "",
    nameRu: "",
    nameEn: "",
    descriptionUz: "",
    descriptionRu: "",
    descriptionEn: "",
    price: 0,
    categoryId: "",
    brand: "",
    weight: "",
    calories: "",
    imageUrl: "",
    isAvailable: true,
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (existing && !initialized) {
    setForm({
      nameUz: existing.nameUz || "",
      nameRu: existing.nameRu || "",
      nameEn: existing.nameEn || "",
      descriptionUz: existing.descriptionUz || "",
      descriptionRu: existing.descriptionRu || "",
      descriptionEn: existing.descriptionEn || "",
      price: existing.price || 0,
      categoryId: existing.categoryId || "",
      brand: existing.brand || "",
      weight: existing.weight || "",
      calories: existing.calories ? String(existing.calories) : "",
      imageUrl: existing.imageUrl || "",
      isAvailable: existing.isAvailable ?? true,
    });
    setPreview(existing.imageUrl || "");
    setInitialized(true);
  }

  async function handleImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm fayli");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maksimal 5MB");
      return;
    }
    setPreview(URL.createObjectURL(file));
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
      setPreview("");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImage(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameUz || !form.nameRu || !form.categoryId || !form.price) {
      toast.error("Majburiy maydonlarni to‘ldiring");
      return;
    }
    try {
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          calories: form.calories ? Number(form.calories) : undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Xato");
      toast.success("Saqlandi ✓");
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
          <h1 className="font-serif text-2xl text-primary">{productId ? "Tahrirlash" : "Yangi taom"}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-6 space-y-6 pb-28">
        {/* Rasm */}
        <section className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="font-medium mb-3">Rasm</h2>
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition"
          >
            {preview || form.imageUrl ? (
              <div className="relative inline-block">
                <img src={preview || form.imageUrl} alt="" className="w-48 h-36 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setForm((f) => ({ ...f, imageUrl: "" }));
                  }}
                  className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload className="mx-auto mb-2 text-muted" />
                <p className="text-sm text-muted">Rasmni bu yerga tashlang yoki tanlang</p>
                <p className="text-xs text-subtle mt-1">JPG, PNG, WEBP · max 5 MB</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                />
              </label>
            )}
            {uploading && <p className="text-sm text-muted mt-2">Yuklanmoqda...</p>}
          </div>
        </section>

        {/* Asosiy */}
        <section className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-medium">Asosiy ma’lumot</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Nomi (UZ) *</label>
            <input
              value={form.nameUz}
              onChange={(e) => setForm({ ...form, nameUz: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomi (RU) *</label>
            <input
              value={form.nameRu}
              onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomi (EN)</label>
            <input
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tavsif (UZ)</label>
            <textarea
              value={form.descriptionUz}
              onChange={(e) => setForm({ ...form, descriptionUz: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2 h-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tavsif (RU)</label>
            <textarea
              value={form.descriptionRu}
              onChange={(e) => setForm({ ...form, descriptionRu: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2 h-20"
            />
          </div>
        </section>

        {/* Narx */}
        <section className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-medium">Narx va kategoriya</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Narx (so‘m) *</label>
            <input
              type="number"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border border-border rounded-xl px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategoriya *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2"
              required
            >
              <option value="">Tanlang</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.nameUz}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Qo'shimcha */}
        <section className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-medium">Qo‘shimcha</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Brend</label>
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vazni</label>
              <input
                placeholder="350 g"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kaloriya</label>
              <input
                type="number"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Holat */}
        <section className="bg-surface border border-border rounded-2xl p-5">
          <label className="flex items-center justify-between">
            <span className="font-medium">{form.isAvailable ? "Sotuvda bor" : "Stop-list"}</span>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              className="w-10 h-5"
            />
          </label>
        </section>
      </form>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex gap-3 justify-end">
          <Link href="/admin/menu" className="px-5 py-2.5 text-sm border border-border rounded-xl">
            Bekor qilish
          </Link>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
