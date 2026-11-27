"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SettingsPage() {
  const { data, mutate, isLoading } = useSWR("/api/settings", fetcher);
  const [form, setForm] = useState({
    restaurantName: "",
    tagline: "",
    phone: "",
    instagram: "",
    stopListMode: "gray",
    logoUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setForm({
        restaurantName: data.data.restaurantName || "",
        tagline: data.data.tagline || "",
        phone: data.data.phone || "",
        instagram: data.data.instagram || "",
        stopListMode: data.data.stopListMode || "gray",
        logoUrl: data.data.logoUrl || "",
      });
    }
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) throw new Error();
      toast.success("Saqlandi");
      mutate();
    } catch {
      toast.error("Xato");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/admin" className="text-muted hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-2xl text-primary">Sozlamalar</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Restoran nomi</label>
          <input
            value={form.restaurantName}
            onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
            className="w-full border border-border rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full border border-border rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Telefon</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-border rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Instagram</label>
          <input
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            className="w-full border border-border rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Stop-list rejimi</label>
          <select
            value={form.stopListMode}
            onChange={(e) => setForm({ ...form, stopListMode: e.target.value })}
            className="w-full border border-border rounded-xl px-3 py-2"
          >
            <option value="gray">Kulrang (ko‘rsatish)</option>
            <option value="hide">Yashirish</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
