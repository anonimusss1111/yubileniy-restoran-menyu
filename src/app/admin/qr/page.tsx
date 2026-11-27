"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QRCode from "qrcode";

export default function QRPage() {
  const [table, setTable] = useState(1);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/?table=${table}`;

  async function generate() {
    setLoading(true);
    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 1024, margin: 2 });
      setQrDataUrl(dataUrl);
    } catch {
      alert("QR yaratishda xato");
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `table-${table}-qr.png`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/admin" className="text-muted hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-2xl text-primary">QR kodlar</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">Stol raqami</label>
          <input
            type="number"
            min={1}
            max={999}
            value={table}
            onChange={(e) => setTable(Number(e.target.value))}
            className="w-full border border-border rounded-xl px-3 py-2"
          />
        </div>
        <p className="text-xs text-muted break-all">{url}</p>
        <button
          onClick={generate}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {loading ? "Yaratilmoqda..." : "QR yaratish"}
        </button>
        {qrDataUrl && (
          <div className="text-center">
            <img src={qrDataUrl} alt="QR" className="mx-auto w-64 h-64 bg-white p-2 rounded-2xl" />
            <button onClick={download} className="mt-4 text-sm text-primary underline">
              PNG yuklab olish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
