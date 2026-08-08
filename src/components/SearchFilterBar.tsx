"use client";

import { useState } from "react";
import clsx from "clsx";
import { AMBIENCE_OPTIONS, WFC_OPTIONS } from "@/lib/options";

export type Filters = {
  query: string;
  wfc: string | null;
  ambience: string[];
};

export function SearchFilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const activeCount = (filters.wfc ? 1 : 0) + filters.ambience.length;

  function toggleAmbience(v: string) {
    const next = filters.ambience.includes(v)
      ? filters.ambience.filter((x) => x !== v)
      : [...filters.ambience, v];
    onChange({ ...filters, ambience: next });
  }

  return (
    <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm pb-3 pt-1">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-soft/70">
            🔍
          </span>
          <input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Cari nama kafe..."
            className="w-full rounded-full border border-line bg-paper pl-10 pr-4 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/60 outline-none focus:ring-2 focus:ring-crema transition"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className={clsx(
            "relative shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition active:scale-95",
            showFilters || activeCount > 0
              ? "bg-coffee text-cream border-coffee"
              : "bg-paper text-espresso-soft border-line"
          )}
        >
          ⚙️ Filter
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-clay text-cream text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mt-3 bg-paper border border-line rounded-2xl p-4 space-y-3 animate-pop-in">
          <div>
            <p className="text-xs font-semibold text-espresso-soft mb-1.5 uppercase tracking-wide">
              Cocok WFC
            </p>
            <div className="flex flex-wrap gap-2">
              {WFC_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      wfc: filters.wfc === opt.value ? null : opt.value,
                    })
                  }
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95",
                    filters.wfc === opt.value
                      ? "bg-crema text-espresso border-crema"
                      : "bg-cream-soft text-espresso-soft border-line"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-espresso-soft mb-1.5 uppercase tracking-wide">
              Ambience
            </p>
            <div className="flex flex-wrap gap-2">
              {AMBIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleAmbience(opt.value)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95",
                    filters.ambience.includes(opt.value)
                      ? "bg-crema text-espresso border-crema"
                      : "bg-cream-soft text-espresso-soft border-line"
                  )}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, wfc: null, ambience: [] })}
              className="text-xs text-clay font-medium underline"
            >
              Reset filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
