"use client";

import { useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { PhotoUploader } from "@/components/PhotoUploader";
import { StarDisplay } from "@/components/StarRating";
import { CafeForm, type CafeFormValues } from "@/components/CafeForm";
import {
  ACCESS_OPTIONS,
  AMBIENCE_OPTIONS,
  POWER_OPTIONS,
  SEATING_OPTIONS,
  WFC_OPTIONS,
  ambienceEmoji,
  labelFor,
} from "@/lib/options";
import type { CafeWithPhotos } from "@/lib/types";

export function CafeDetailClient({ cafe: initialCafe }: { cafe: CafeWithPhotos }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewlyCreated = searchParams.get("new") === "1";
  const [cafe, setCafe] = useState(initialCafe);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const visitDate = new Date(cafe.visitDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function handleUpdate(values: CafeFormValues) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/cafes/${cafe.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan perubahan");
      }
      const updated = await res.json();
      setCafe(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus catatan "${cafe.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/cafes/${cafe.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kafe");
      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      setDeleting(false);
    }
  }

  return (
    <main className="flex-1 px-4 sm:px-6 max-w-2xl w-full mx-auto pb-16 pt-6">
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/"
          className="text-espresso-soft hover:text-espresso text-xl leading-none active:scale-90 transition"
          aria-label="Kembali"
        >
          ←
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-line bg-paper text-espresso hover:border-coffee-light active:scale-95 transition"
          >
            {editing ? "Batal" : "✏️ Edit"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-clay/30 bg-clay/10 text-clay active:scale-95 transition disabled:opacity-50"
          >
            {deleting ? "..." : "🗑️"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-clay bg-clay/10 rounded-xl px-4 py-3 text-sm mb-4">{error}</p>
      )}

      {editing ? (
        <CafeForm
          initial={{
            ...cafe,
            mapsUrl: cafe.mapsUrl ?? "",
            menuNotes: cafe.menuNotes ?? "",
            ambienceNotes: cafe.ambienceNotes ?? "",
            accessNotes: cafe.accessNotes ?? "",
            additionalNotes: cafe.additionalNotes ?? "",
          }}
          onSubmit={handleUpdate}
          submitting={submitting}
          submitLabel="Simpan Perubahan"
        />
      ) : (
        <div className="space-y-6 animate-pop-in">
          <PhotoCarousel photos={cafe.photos} alt={cafe.name} className="h-56 w-full" />

          <div>
            <h1 className="font-display text-2xl font-bold text-espresso">{cafe.name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <StarDisplay rating={cafe.rating} size="text-xl" />
              <span className="text-sm text-espresso-soft">Dikunjungi {visitDate}</span>
            </div>
            {cafe.mapsUrl && (
              <a
                href={cafe.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-coffee bg-crema-soft/60 hover:bg-crema-soft px-4 py-2 rounded-full transition active:scale-95"
              >
                📍 Buka di Google Maps
              </a>
            )}
          </div>

          <section>
            <h2 className="text-xs font-semibold text-espresso-soft uppercase tracking-wide mb-2">
              Foto
            </h2>
            {isNewlyCreated && cafe.photos.length === 0 && (
              <p className="text-sm text-coffee bg-crema-soft/50 border border-crema/60 rounded-xl px-3 py-2 mb-2 animate-pop-in">
                Kafe tersimpan! Tambahkan sampai 3 foto suasana/menu di sini. 📸
              </p>
            )}
            <PhotoUploader
              cafeId={cafe.id}
              photos={cafe.photos}
              onPhotosChange={(photos) => setCafe((c) => ({ ...c, photos }))}
            />
          </section>

          {cafe.seating.length > 0 && (
            <InfoRow label="Kondisi Tempat">
              <div className="flex flex-wrap gap-1.5">
                {cafe.seating.map((s) => (
                  <Pill key={s}>{labelFor(SEATING_OPTIONS, s)}</Pill>
                ))}
              </div>
            </InfoRow>
          )}

          {cafe.menuNotes && (
            <InfoRow label="Menu Favorit">
              <p className="whitespace-pre-line text-espresso">{cafe.menuNotes}</p>
            </InfoRow>
          )}

          {(cafe.ambienceTags.length > 0 || cafe.ambienceNotes) && (
            <InfoRow label="Ambience / Vibe">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {cafe.ambienceTags.map((tag) => (
                  <Pill key={tag}>
                    {ambienceEmoji(tag)} {labelFor(AMBIENCE_OPTIONS, tag)}
                  </Pill>
                ))}
              </div>
              {cafe.ambienceNotes && (
                <p className="text-espresso-soft text-sm italic">
                  &ldquo;{cafe.ambienceNotes}&rdquo;
                </p>
              )}
            </InfoRow>
          )}

          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Colokan" value={labelFor(POWER_OPTIONS, cafe.powerOutlet)} />
            <StatBox label="Cocok WFC" value={labelFor(WFC_OPTIONS, cafe.wfcRating)} />
          </div>

          <InfoRow label="Akses / Rute">
            <Pill>{labelFor(ACCESS_OPTIONS, cafe.accessLevel)}</Pill>
            {cafe.accessNotes && (
              <p className="text-espresso-soft text-sm mt-2">{cafe.accessNotes}</p>
            )}
          </InfoRow>

          {cafe.additionalNotes && (
            <InfoRow label="Catatan Tambahan">
              <p className="whitespace-pre-line text-espresso">{cafe.additionalNotes}</p>
            </InfoRow>
          )}
        </div>
      )}
    </main>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-espresso-soft uppercase tracking-wide mb-2">
        {label}
      </h2>
      {children}
    </section>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-cream-soft border border-line rounded-full px-3 py-1 text-sm text-espresso">
      {children}
    </span>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-line rounded-2xl px-4 py-3">
      <p className="text-xs text-espresso-soft uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-semibold text-espresso">{value}</p>
    </div>
  );
}
