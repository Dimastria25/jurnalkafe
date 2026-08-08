"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CafeCard } from "@/components/CafeCard";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { StarDisplay } from "@/components/StarRating";
import { SearchFilterBar, type Filters } from "@/components/SearchFilterBar";
import { FAB } from "@/components/FAB";
import type { CafeWithPhotos } from "@/lib/types";

export default function DashboardPage() {
  const [cafes, setCafes] = useState<CafeWithPhotos[] | null>(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({
    query: "",
    wfc: null,
    ambience: [],
  });

  useEffect(() => {
    fetch("/api/cafes")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then(setCafes)
      .catch((e) => setError(e.message));
  }, []);

  const recent = useMemo(() => {
    if (!cafes) return [];
    return [...cafes]
      .sort(
        (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
      )
      .slice(0, 8);
  }, [cafes]);

  const filtered = useMemo(() => {
    if (!cafes) return [];
    return cafes.filter((c) => {
      if (
        filters.query &&
        !c.name.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false;
      }
      if (filters.wfc && c.wfcRating !== filters.wfc) return false;
      if (
        filters.ambience.length > 0 &&
        !filters.ambience.every((a) => c.ambienceTags.includes(a as never))
      ) {
        return false;
      }
      return true;
    });
  }, [cafes, filters]);

  return (
    <main className="flex-1 px-4 sm:px-6 max-w-5xl w-full mx-auto pb-28 pt-6">
      <header className="mb-5">
        <p className="text-sm text-espresso-soft">Halo! ☕</p>
        <h1 className="font-display text-3xl font-bold text-espresso mt-0.5">
          Jurnal Kafe Bandung
        </h1>
      </header>

      {error && (
        <p className="text-clay bg-clay/10 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </p>
      )}

      {cafes === null && !error && (
        <div className="py-20 text-center text-espresso-soft animate-pulse">
          Menyeduh data...
        </div>
      )}

      {cafes !== null && cafes.length === 0 && (
        <div className="text-center py-16 bg-paper rounded-3xl border border-line animate-pop-in">
          <div className="text-5xl mb-3">🌱</div>
          <p className="font-display text-xl font-semibold text-espresso mb-1">
            Belum ada kafe tercatat
          </p>
          <p className="text-espresso-soft text-sm mb-5">
            Yuk mulai catat kafe pertama kalian.
          </p>
          <Link
            href="/cafe/new"
            className="inline-block bg-coffee text-cream font-semibold px-5 py-2.5 rounded-full active:scale-95 hover:bg-espresso-soft transition"
          >
            + Tambah Kafe
          </Link>
        </div>
      )}

      {cafes !== null && cafes.length > 0 && (
        <>
          {recent.length > 0 && (
            <section className="mb-6">
              <h2 className="font-display text-lg font-semibold text-espresso mb-3">
                Baru Dikunjungi
              </h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1 snap-x snap-mandatory">
                {recent.map((cafe) => (
                  <Link
                    key={cafe.id}
                    href={`/cafe/${cafe.id}`}
                    className="shrink-0 w-56 snap-start bg-paper rounded-2xl border border-line overflow-hidden shadow-sm active:scale-[0.98] hover:shadow-md transition-all"
                  >
                    <PhotoCarousel photos={cafe.photos} alt={cafe.name} className="h-32 w-full" />
                    <div className="p-3">
                      <h3 className="font-display font-semibold text-espresso line-clamp-1">
                        {cafe.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <StarDisplay rating={cafe.rating} size="text-sm" />
                        <span className="text-[11px] text-espresso-soft">
                          {new Date(cafe.visitDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <SearchFilterBar filters={filters} onChange={setFilters} />

          {filtered.length === 0 ? (
            <p className="text-center text-espresso-soft py-12 text-sm">
              Tidak ada kafe yang cocok dengan pencarian/filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>
          )}
        </>
      )}

      <FAB />
    </main>
  );
}
