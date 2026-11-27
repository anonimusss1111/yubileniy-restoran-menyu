"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { getDict, pick, type Lang } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomerPage() {
  const [lang, setLang] = useState<Lang>("uz");
  const dict = getDict(lang);
  const { data, error, isLoading } = useSWR("/api/public/menu", fetcher, { refreshInterval: 30000 });

  if (isLoading) return <div className="p-8 text-center">{dict.common.loading}</div>;
  if (error || !data?.ok) return <div className="p-8 text-center text-danger">{dict.common.error}</div>;

  const { categories, promos, settings } = data.data;
  const restaurantName = settings.restaurantName || "Yubileniy";

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-surface border-b border-border p-4 flex justify-between items-center">
        <h1 className="font-serif text-2xl text-primary">{restaurantName}</h1>
        <div className="flex gap-2">
          {(["uz", "ru", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn("px-3 py-1 rounded-full text-sm", lang === l ? "bg-primary text-primary-foreground" : "bg-border")}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {promos.length > 0 && (
        <div className="p-4">
          <div className="flex overflow-x-auto gap-4 pb-2">
            {promos.map((p: any) => (
              <div key={p.id} className="min-w-[280px] rounded-3xl overflow-hidden shadow-soft relative">
                <img src={p.imageUrl} alt="" className="w-full h-40 object-cover" />
                {p.badge && <span className="absolute top-2 right-2 bg-danger text-white px-2 py-1 rounded-full text-xs">{p.badge}</span>}
                <div className="p-3 bg-surface">
                  <h3 className="font-serif">{pick(p, "title", lang)}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-20">
        {categories.map((cat: any) => (
          <section key={cat.id} className="mb-8">
            <h2 className="font-serif text-xl mb-4 text-primary">{pick(cat, "name", lang)}</h2>
            <div className="grid gap-4">
              {cat.products.map((prod: any) => (
                <div
                  key={prod.id}
                  className={cn(
                    "bg-surface rounded-2xl overflow-hidden shadow-soft flex",
                    !prod.isAvailable && "opacity-60 grayscale"
                  )}
                >
                  <img src={prod.imageUrl || "/seed/placeholder.svg"} alt="" className="w-24 h-24 object-cover" />
                  <div className="p-3 flex-1">
                    <h3 className="font-medium">{pick(prod, "name", lang)}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pick(prod, "description", lang)}</p>
                    <div className="mt-2 font-semibold text-primary">{formatPrice(prod.price, lang)}</div>
                    {!prod.isAvailable && <span className="text-xs text-danger">{dict.product.outOfStock}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
