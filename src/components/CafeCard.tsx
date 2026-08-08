"use client";

import { useRouter } from "next/navigation";
import { PhotoCarousel } from "./PhotoCarousel";
import { StarDisplay } from "./StarRating";
import { ambienceEmoji } from "@/lib/options";
import type { CafeWithPhotos } from "@/lib/types";

export function CafeCard({ cafe }: { cafe: CafeWithPhotos }) {
  const router = useRouter();
  const visitDate = new Date(cafe.visitDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/cafe/${cafe.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/cafe/${cafe.id}`);
      }}
      className="group block bg-paper rounded-2xl border border-line overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <PhotoCarousel
        photos={cafe.photos}
        alt={cafe.name}
        className="h-40 w-full"
      />
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-espresso leading-tight line-clamp-1">
          {cafe.name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <StarDisplay rating={cafe.rating} />
          <span className="text-xs text-espresso-soft">{visitDate}</span>
        </div>

        {cafe.ambienceTags.length > 0 && (
          <div className="flex gap-1 mt-2 text-base">
            {cafe.ambienceTags.slice(0, 5).map((tag) => (
              <span key={tag}>{ambienceEmoji(tag)}</span>
            ))}
          </div>
        )}

        {cafe.mapsUrl && (
          <a
            href={cafe.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-coffee bg-crema-soft/60 hover:bg-crema-soft px-3 py-1.5 rounded-full transition active:scale-95"
          >
            📍 Buka Maps
          </a>
        )}
      </div>
    </div>
  );
}
