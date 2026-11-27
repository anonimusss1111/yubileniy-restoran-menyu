"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getDict } from "@/lib/i18n";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dict = getDict("uz");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Kirildi");
        router.push("/admin");
      } else {
        toast.error(data.error?.message || "Xato");
      }
    } catch {
      toast.error("Tarmoq xatosi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-3xl shadow-soft w-full max-w-sm">
        <h1 className="font-serif text-2xl text-center mb-6 text-primary">Admin</h1>
        <input
          type="text"
          placeholder="Login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-border rounded-full"
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder={dict.admin.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-border rounded-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? dict.common.loading : dict.admin.login}
        </button>
      </form>
    </div>
  );
}
