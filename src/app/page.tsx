"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { getDict, pick, type Lang } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Search, X, ClipboardList, QrCode } from "lucide-react";
import AppBackground from "@/components/AppBackground";
import QRCode from "qrcode";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomerPage() {
  const [lang, setLang] = useState<Lang>("uz");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tableNum, setTableNum] = useState<number | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    if (t) {
      const n = parseInt(t, 10);
      if (n >= 1 && n <= 999) setTableNum(n);
    }
  }, []);
  const dict = getDict(lang);
  const { data, error, isLoading } = useSWR("/api/public/menu", fetcher, { refreshInterval: 30000 });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted text-sm">{dict.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center text-danger">{dict.common.error}</div>
      </div>
    );
  }

  const { categories, promos, settings } = data.data;
  const restaurantName = settings.restaurantName || "Yubileniy";

  const filteredCategories = searchQuery
    ? categories
        .map((cat: any) => ({
          ...cat,
          products: cat.products.filter((p: any) =>
            [p.nameUz, p.nameRu, p.nameEn].some((n) => n?.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((cat: any) => cat.products.length > 0)
    : categories;

  return (
    <div className="min-h-screen relative">
      <AppBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-900/80 backdrop-blur-md border-b border-gold-500/25 text-cream">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          {!searchOpen ? (
            <>
              <div className="flex items-center gap-3">
                <img src="/brand/logo-64.webp" alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-500" />
                <div>
                  <h1 className="font-serif text-xl text-gold-400 leading-none">{restaurantName}</h1>
                  <p className="text-[11px] text-muted mt-0.5">Raqamli menyu</p>
                  {tableNum && (
                    <span className="inline-block mt-1 text-[10px] bg-accent text-white px-2 py-0.5 rounded-full">
                      Stol #{tableNum}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-gold-400 transition"
                  aria-label={dict.header.search}
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={async () => {
                    const url = window.location.href;
                    const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
                    setQrUrl(dataUrl);
                    setQrOpen(true);
                  }}
                  className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-gold-400 transition"
                  aria-label="QR"
                >
                  <QrCode size={20} />
                </button>
                <div className="flex bg-background-alt p-1 rounded-full">
                  {(["uz", "ru", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                        lang === l ? "bg-primary text-gold-400-foreground" : "text-muted"
                      )}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.search.placeholder}
                  className="w-full h-11 pl-10 pr-10 rounded-full bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-sm text-gold-400 font-medium px-2"
              >
                Bekor
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-56 bg-background-alt overflow-hidden">
        <img
          src="/images/bg-restaurant-640.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-6 left-0 right-0 max-w-lg mx-auto px-4 text-white">
          <h1 className="font-serif text-3xl">{restaurantName}</h1>
          <p className="text-sm opacity-90 mt-1">Raqamli menyu</p>
          {tableNum && (
            <span className="inline-block mt-2 text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              Stol #{tableNum}
            </span>
          )}
        </div>
      </div>

      {/* Sticky category bar */}
      {!searchQuery && (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-gold-400-foreground whitespace-nowrap">
              Barchasi
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                className="px-4 py-2 rounded-full text-sm font-medium bg-surface border border-border whitespace-nowrap"
              >
                {pick(cat, "name", lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* Promos */}
        {promos.length > 0 && !searchQuery && (
          <div className="px-4 py-5">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {promos.map((p: any) => (
                <div
                  key={p.id}
                  className="min-w-[85%] snap-center bg-surface rounded-3xl overflow-hidden shadow-md border border-border"
                >
                  <div className="relative aspect-[16/9]">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-gold-400-foreground text-xs font-bold px-3 py-1 rounded-full -rotate-3 shadow-md">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif text-xl">{pick(p, "title", lang)}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories & Products */}
        <div className="px-4 pb-24 space-y-10">
          {filteredCategories.length === 0 && searchQuery && (
            <div className="text-center py-16 text-muted">
              <p className="text-lg">{dict.search.noResults}</p>
            </div>
          )}
          {filteredCategories.map((cat: any) => (
            <section key={cat.id}>
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-serif text-2xl text-gold-400">{pick(cat, "name", lang)}</h2>
                <span className="text-xs text-muted">{cat.products.length} ta</span>
              </div>
              <div className="space-y-4">
                {cat.products.map((prod: any) => (
                  <div
                    key={prod.id}
                    className={cn(
                      "bg-surface rounded-2xl p-3 shadow-sm border border-border flex gap-3 active:scale-[0.985] transition-transform",
                      !prod.isAvailable && "opacity-60"
                    )}
                  >
                    <div className="w-[104px] h-[104px] flex-shrink-0 rounded-2xl overflow-hidden bg-background-alt">
                      <img
                        src={prod.imageUrl || "/seed/placeholder.svg"}
                        alt={pick(prod, "name", lang)}
                        className={cn("w-full h-full object-cover", !prod.isAvailable && "grayscale")}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="font-semibold text-[15px] leading-tight line-clamp-2 text-foreground">
                          {pick(prod, "name", lang)}
                        </h3>
                        {pick(prod, "description", lang) && (
                          <p className="text-[13px] text-muted mt-1 line-clamp-2 leading-relaxed">
                            {pick(prod, "description", lang)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={cn("font-bold text-gold-400 tabular-nums", !prod.isAvailable && "text-muted")}>
                          {formatPrice(prod.price, lang)}
                        </span>
                        {!prod.isAvailable && (
                          <span className="text-[10px] uppercase tracking-wide text-danger bg-danger-soft px-2 py-0.5 rounded-full font-medium">
                            {dict.product.outOfStock}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {qrOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={() => setQrOpen(false)}>
          <div className="bg-surface rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-center mb-4">Menyuni ulashish</h3>
            {qrUrl && <img src={qrUrl} alt="QR" className="mx-auto w-56 h-56" />}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Havola nusxalandi");
                }}
                className="flex-1 py-2 text-sm border border-border rounded-xl"
              >
                Nusxalash
              </button>
              <button onClick={() => setQrOpen(false)} className="flex-1 py-2 text-sm bg-primary text-gold-400-foreground rounded-xl">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Selection placeholder */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button className="h-14 px-6 bg-primary text-gold-400-foreground rounded-full shadow-lg flex items-center gap-2 font-medium text-sm">
          <ClipboardList size={18} />
          <span>Tanlanganlar</span>
        </button>
      </div>
    </div>
  );
}
