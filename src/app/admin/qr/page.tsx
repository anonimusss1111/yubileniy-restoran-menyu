"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import QRCode from "qrcode";
import { buildMenuUrl, isLocalhostUrl } from "@/lib/urls";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function QRPage() {
  const { data: settingsData, mutate } = useSWR("/api/settings", fetcher);
  const { data: netData } = useSWR("/api/admin/network-info", fetcher);

  const [baseUrl, setBaseUrl] = useState("");
  const [table, setTable] = useState(1);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settingsData?.data?.publicBaseUrl) {
      setBaseUrl(settingsData.data.publicBaseUrl);
    } else if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, [settingsData]);

  const menuUrl = buildMenuUrl({ table, baseUrl });
  const isLocal = isLocalhostUrl(baseUrl || menuUrl);

  useEffect(() => {
    if (!menuUrl) return;
    QRCode.toDataURL(menuUrl, { width: 512, margin: 2, errorCorrectionLevel: "M" }).then(setQrDataUrl).catch(() => {});
  }, [menuUrl]);

  async function saveBaseUrl() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicBaseUrl: baseUrl.replace(/\/+$/, "") }),
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

  function downloadPng(size: number) {
    QRCode.toDataURL(menuUrl, { width: size, margin: 2 }).then((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `table-${table}-qr-${size}.png`;
      a.click();
    });
  }

  const suggestions = (netData?.data?.ips || []).map((ip: string) => `http://${ip}:${netData?.data?.port || 3000}`);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/admin" className="text-muted hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-2xl text-primary">QR kodlar</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {isLocal && (
          <div className="bg-warning/10 border border-warning text-warning-foreground text-sm p-3 rounded-xl">
            Bu manzil faqat shu kompyuterda ishlaydi. Telefon uchun kompyuter IP manzilini yoki domenni kiriting.
          </div>
        )}

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
          <label className="block text-sm font-medium">Saytning ochiq manzili (Base URL)</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://192.168.1.23:3000"
            className="w-full border border-border rounded-xl px-3 py-2 text-sm"
          />
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s: string) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setBaseUrl(s)}
                  className="text-xs bg-primary-soft text-primary px-3 py-1 rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <button onClick={saveBaseUrl} disabled={saving} className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl">
            {saving ? "..." : "Saqlash"}
          </button>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stol raqami (1–999)</label>
            <input
              type="number"
              min={1}
              max={999}
              value={table}
              onChange={(e) => setTable(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
              className="w-32 border border-border rounded-xl px-3 py-2"
            />
          </div>

          <div className="text-center">
            {qrDataUrl && <img src={qrDataUrl} alt="QR" className="mx-auto w-56 h-56 bg-white p-2 rounded-2xl" />}
            <p className="text-xs text-muted mt-2 break-all">{menuUrl}</p>
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(menuUrl);
                  toast.success("Nusxalandi");
                }}
                className="text-sm flex items-center gap-1 border border-border px-3 py-1.5 rounded-lg"
              >
                <Copy size={14} /> Nusxalash
              </button>
              <a href={menuUrl} target="_blank" rel="noreferrer" className="text-sm flex items-center gap-1 border border-border px-3 py-1.5 rounded-lg">
                <ExternalLink size={14} /> Ochish
              </a>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button onClick={() => downloadPng(1024)} className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl">
              PNG 1024
            </button>
            <button onClick={() => downloadPng(2048)} className="text-sm border border-border px-4 py-2 rounded-xl">
              PNG 2048
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
