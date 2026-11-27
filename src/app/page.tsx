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
          <div className="w-12 h-12 border-4 border-[#8B5E34] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6E6A63] text-sm">{dict.common.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="text-center text-[#B3402F]">{dict.common.error}</div>
      </div>
    );
  }

  const { categories, promos, settings } = data.data;
  const restaurantName = settings.restaurantName || "Yubileniy";

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EFECE6] shadow-sm">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[28px] leading-none text-[#8B5E34]">{restaurantName}</h1>
            <p className="text-xs text-[#6E6A63] mt-1 tracking-wide">Raqamli menyu</p>
          </div>
          <div className="flex gap-1 bg-[#F3EFE9] p-1 rounded-full">
            {(["uz", "ru", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all",
                  lang === l
                    ? "bg-[#8B5E34] text-white shadow-sm"
                    : "text-[#6E6A63] hover:text-[#8B5E34]"
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Promos */}
        {promos.length > 0 && (
          <div className="px-5 py-5">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {promos.map((p: any) => (
                <div
                  key={p.id}
                  className="min-w-[300px] snap-start bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(139,94,52,0.08)] border border-[#EFECE6]"
                >
                  <div className="relative h-40">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    {p.badge && (
                      <span className="absolute top-3 right-3 bg-[#B3402F] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-xl text-[#1F1F1F]">{pick(p, "title", lang)}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories & Products */}
        <div className="px-5 pb-10 space-y-10">
          {categories.map((cat: any) => (
            <section key={cat.id}>
              <h2 className="font-serif text-2xl text-[#8B5E34] mb-5">{pick(cat, "name", lang)}</h2>
              <div className="space-y-4">
                {cat.products?.length > 0 ? (
                  cat.products.map((prod: any) => (
                    <div
                      key={prod.id}
                      className={cn(
                        "bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(139,94,52,0.06)] border border-[#EFECE6] flex transition-opacity",
                        !prod.isAvailable && "opacity-60"
                      )}
                    >
                      <div className="w-28 h-28 flex-shrink-0 bg-[#F3EFE9]">
                        <img
                          src={prod.imageUrl || "/seed/placeholder.svg"}
                          alt={pick(prod, "name", lang)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-medium text-[15px] leading-tight text-[#1F1F1F]">
                            {pick(prod, "name", lang)}
                          </h3>
                          {pick(prod, "description", lang) && (
                            <p className="text-xs text-[#6E6A63] mt-1.5 line-clamp-2 leading-relaxed">
                              {pick(prod, "description", lang)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-semibold text-[#8B5E34] text-[15px]">
                            {formatPrice(prod.price, lang)}
                          </span>
                          {!prod.isAvailable && (
                            <span className="text-[11px] text-[#B3402F] font-medium bg-[#B3402F]/10 px-2 py-0.5 rounded-full">
                              {dict.product.outOfStock}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6E6A63] italic">Bu kategoriyada mahsulot yo‘q</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
