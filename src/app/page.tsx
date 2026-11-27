"use client";

import { useState } from "react";
import useSWR from "swr";
import { getDict, pick, type Lang } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomerPage() {
  const [lang, setLang] = useState<Lang>("uz");
  const dict = getDict(lang);
  const { data, error, isLoading } = useSWR("/api/public/menu", fetcher, { refreshInterval: 30000 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#8B5E34] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6E6A63]">{dict.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="text-center text-[#B3402F]">{dict.common.error}</div>
      </div>
    );
  }

  const { categories, promos, settings } = data.data;
  const restaurantName = settings.restaurantName || "Yubileniy";

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EFECE6]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-[#8B5E34]">{restaurantName}</h1>
            <p className="text-xs text-[#6E6A63]">Raqamli menyu</p>
          </div>
          <div className="flex gap-1 bg-[#EFECE6] p-1 rounded-full">
            {(["uz", "ru", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  lang === l ? "bg-[#8B5E34] text-white" : "text-[#6E6A63]"
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* Promos */}
        {promos.length > 0 && (
          <div className="px-4 py-4">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {promos.map((p: any) => (
                <div key={p.id} className="min-w-[280px] snap-start bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EFECE6]">
                  <div className="relative h-36">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    {p.badge && (
                      <span className="absolute top-3 right-3 bg-[#B3402F] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg">{pick(p, "title", lang)}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories & Products */}
        <div className="px-4 pb-8 space-y-8">
          {categories.map((cat: any) => (
            <section key={cat.id}>
              <h2 className="font-serif text-xl text-[#8B5E34] mb-4">{pick(cat, "name", lang)}</h2>
              <div className="space-y-3">
                {cat.products?.length > 0 ? (
                  cat.products.map((prod: any) => (
                    <div
                      key={prod.id}
                      className={cn(
                        "bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EFECE6] flex",
                        !prod.isAvailable && "opacity-50"
                      )}
                    >
                      <div className="w-24 h-24 flex-shrink-0 bg-[#EFECE6]">
                        <img
                          src={prod.imageUrl || "/seed/placeholder.svg"}
                          alt={pick(prod, "name", lang)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm leading-tight">{pick(prod, "name", lang)}</h3>
                          {pick(prod, "description", lang) && (
                            <p className="text-xs text-[#6E6A63] mt-1 line-clamp-2">{pick(prod, "description", lang)}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-[#8B5E34]">{formatPrice(prod.price, lang)}</span>
                          {!prod.isAvailable && (
                            <span className="text-[10px] text-[#B3402F] font-medium">{dict.product.outOfStock}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6E6A63]">Bu kategoriyada mahsulot yo‘q</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
