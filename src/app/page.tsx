"use client";

import { useState, useEffect, useRef } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const dict = getDict(lang);
  const { data, error, isLoading } = useSWR("/api/public/menu", fetcher, { refreshInterval: 30000 });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    if (t) {
      const n = parseInt(t, 10);
      if (n >= 1 && n <= 999) setTableNum(n);
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AppBackground />
        <div className="text-fg-muted">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AppBackground />
        <div className="text-danger">{dict.common.error}</div>
      </div>
    );
  }

  const { categories, promos, settings } = data.data;
  const restaurantName = settings.restaurantName || "Yubileyka";

  let filteredCategories = categories;

  if (activeCategory) {
    filteredCategories = categories.filter((cat: any) => cat.id === activeCategory);
  }

  if (searchQuery) {
    filteredCategories = filteredCategories
      .map((cat: any) => ({
        ...cat,
        products: cat.products.filter((p: any) =>
          [p.nameUz, p.nameRu, p.nameEn].some((n) => n?.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      }))
      .filter((cat: any) => cat.products.length > 0);
  }

  return (
    <div className="min-h-screen relative text-fg">
      <AppBackground />

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-200",
          scrolled ? "bg-bg-1/92 backdrop-blur-md border-b border-line" : "bg-transparent"
        )}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className={cn("flex items-center gap-2 transition-opacity duration-200", scrolled && !searchOpen ? "opacity-100" : "opacity-0")}>
            <img src="/brand/logo-64.webp" alt="" className="w-8 h-8 rounded-full ring-2 ring-gold-500" />
            <span className="font-serif text-base">{restaurantName}</span>
          </div>
          {!searchOpen ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-white/6 border border-line flex items-center justify-center text-gold-400"
                aria-label="Qidirish"
              >
                <Search size={18} />
              </button>
              <button
                onClick={async () => {
                  const url = window.location.href;
                  const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
                  setQrUrl(dataUrl);
                  setQrOpen(true);
                }}
                className="w-10 h-10 rounded-full bg-white/6 border border-line flex items-center justify-center text-gold-400"
                aria-label="QR"
              >
                <QrCode size={18} />
              </button>
              <div className="flex bg-white/6 border border-line p-1 rounded-full">
                {(["uz", "ru", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      lang === l ? "bg-gradient-to-r from-gold-300 to-gold-500 text-fg-on-gold" : "text-fg-muted"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Taom qidirish..."
                className="flex-1 h-10 px-4 rounded-full bg-bg-2 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-sm text-gold-400"
              >
                Bekor
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="flex flex-col items-center justify-end text-center pt-4 pb-6">
        <img
          src="/brand/logo-192.png"
          alt=""
          className="w-20 h-20 rounded-full ring-2 ring-gold-500 shadow-[0_0_24px_rgba(212,165,55,.35)] mb-2"
        />
        <h1 className="font-serif text-2xl text-fg drop-shadow-lg">{restaurantName}</h1>
        <p className="text-gold-400 text-xs tracking-wider mt-0.5">RAQAMLI MENYU</p>
        {tableNum && (
          <span className="mt-2 text-xs border border-gold-500 text-gold-400 px-3 py-1 rounded-full">
            Stol #{tableNum}
          </span>
        )}
      </div>

      {/* Category bar */}
      {!searchQuery && (
        <div className="sticky top-14 z-40 bg-bg-1/92 backdrop-blur border-b border-line">
          <div className="max-w-lg mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                activeCategory === null
                  ? "bg-gradient-to-r from-gold-300 to-gold-500 text-fg-on-gold"
                  : "bg-white/6 border border-line text-fg"
              )}
            >
              Barchasi
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-gold-300 to-gold-500 text-fg-on-gold"
                    : "bg-white/6 border border-line text-fg"
                )}
              >
                {pick(cat, "name", lang)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* Promos */}
        {promos.length > 0 && !searchQuery && !activeCategory && (
          <div className="px-4 py-5">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {promos.map((p: any) => (
                <div key={p.id} className="min-w-[85%] snap-center card-surface rounded-3xl overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    <img src={p.imageUrl || "/brand/logo-512.webp"} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-0/85 to-transparent" />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-gold-300 to-gold-500 text-fg-on-gold text-xs font-bold px-3 py-1 rounded-full -rotate-3">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-serif text-xl text-fg">{pick(p, "title", lang)}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="px-4 pb-28 space-y-10">
          {filteredCategories.length === 0 && (
            <div className="text-center py-16 text-fg-muted">Hech narsa topilmadi</div>
          )}
          {filteredCategories.map((cat: any) => (
            <section key={cat.id}>
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-serif text-2xl text-fg drop-shadow">{pick(cat, "name", lang)}</h2>
                <span className="text-xs text-gold-400">{cat.products.length} ta</span>
              </div>
              <div className="space-y-4">
                {cat.products.map((prod: any) => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={cn("card-surface rounded-2xl p-3 flex gap-3 w-full text-left", !prod.isAvailable && "opacity-60")}
                  >
                    <div className="w-[104px] h-[104px] flex-shrink-0 rounded-2xl overflow-hidden bg-bg-2">
                      <img
                        src={prod.imageUrl || "/brand/logo-512.webp"}
                        alt=""
                        className={cn("w-full h-full object-cover", !prod.isAvailable && "grayscale")}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-[17px] text-fg line-clamp-2">{pick(prod, "name", lang)}</h3>
                        {pick(prod, "description", lang) && (
                          <p className="text-[13px] text-fg-muted mt-1 line-clamp-2">{pick(prod, "description", lang)}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-gold-300 tabular-nums">{formatPrice(prod.price, lang)}</span>
                        {!prod.isAvailable && (
                          <span className="text-[10px] uppercase text-danger bg-danger-bg px-2 py-0.5 rounded-full">
                            Vaqtincha tugagan
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Product Detail Sheet */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center" onClick={() => setSelectedProduct(null)}>
          <div
            className="bg-bg-1 border-t border-line rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedProduct.imageUrl || "/brand/logo-512.webp"}
                alt=""
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-bg-0/80 border border-line flex items-center justify-center text-fg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h2 className="font-serif text-2xl text-fg">{pick(selectedProduct, "name", lang)}</h2>
                {pick(selectedProduct, "description", lang) && (
                  <p className="text-fg-muted mt-2">{pick(selectedProduct, "description", lang)}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gold-300">{formatPrice(selectedProduct.price, lang)}</span>
                {!selectedProduct.isAvailable && (
                  <span className="text-xs uppercase text-danger bg-danger-bg px-3 py-1 rounded-full">Vaqtincha tugagan</span>
                )}
              </div>
              {(selectedProduct.weight || selectedProduct.calories || selectedProduct.brand) && (
                <div className="flex gap-4 text-sm text-fg-muted border-t border-line pt-4">
                  {selectedProduct.weight && <span>Vazni: {selectedProduct.weight}</span>}
                  {selectedProduct.calories && <span>Kaloriya: {selectedProduct.calories}</span>}
                  {selectedProduct.brand && <span>Brend: {selectedProduct.brand}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={() => setQrOpen(false)}>
          <div className="bg-bg-2 border border-line rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-center mb-4 text-fg">Menyuni ulashish</h3>
            {qrUrl && <img src={qrUrl} alt="QR" className="mx-auto w-56 h-56 bg-white p-2 rounded-2xl" />}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Nusxalandi");
                }}
                className="flex-1 py-2 text-sm border border-line rounded-xl text-fg"
              >
                Nusxalash
              </button>
              <button onClick={() => setQrOpen(false)} className="flex-1 py-2 text-sm bg-gradient-to-r from-gold-300 to-gold-500 text-fg-on-gold rounded-xl">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
