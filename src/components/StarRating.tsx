"use client";

import { useState } from "react";
import clsx from "clsx";

export function StarDisplay({ rating, size = "text-base" }: { rating: number; size?: string }) {
  return (
    <div className={clsx("flex gap-0.5", size)} aria-label={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-crema" : "text-line"}>
          {n <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          className={clsx(
            "text-3xl leading-none transition-transform active:scale-90 hover:scale-110",
            n <= active ? "text-crema" : "text-line"
          )}
          aria-label={`${n} bintang`}
        >
          {n <= active ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
