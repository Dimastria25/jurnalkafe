"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { uploadCafePhoto } from "@/lib/photoUpload";
import { MAX_PHOTOS_PER_CAFE } from "@/lib/options";
import type { Photo } from "@/generated/prisma";

export function PhotoUploader({
  cafeId,
  photos,
  onPhotosChange,
}: {
  cafeId: string;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);

  const slots = Array.from({ length: MAX_PHOTOS_PER_CAFE }, (_, i) => photos[i] ?? null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const replaceId = replaceTargetRef.current;
      if (replaceId) {
        await fetch(`/api/photos/${replaceId}`, { method: "DELETE" });
      }
      const photo = await uploadCafePhoto(cafeId, file);
      const withoutReplaced = replaceId
        ? photos.filter((p) => p.id !== replaceId)
        : photos;
      onPhotosChange([...withoutReplaced, photo]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal upload foto");
    } finally {
      setUploading(false);
      replaceTargetRef.current = null;
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus foto");
      onPhotosChange(photos.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus foto");
    } finally {
      setDeletingId(null);
    }
  }

  function triggerAdd() {
    replaceTargetRef.current = null;
    inputRef.current?.click();
  }

  function triggerReplace(id: string) {
    replaceTargetRef.current = id;
    inputRef.current?.click();
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="grid grid-cols-3 gap-2">
        {slots.map((photo, i) =>
          photo ? (
            <div
              key={photo.id}
              className="relative aspect-square rounded-xl overflow-hidden border border-line group"
            >
              <Image
                src={photo.url}
                alt="Foto kafe"
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => triggerReplace(photo.id)}
                  className="bg-paper/90 text-espresso text-xs font-medium px-2 py-1 rounded-full active:scale-95"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  disabled={deletingId === photo.id}
                  onClick={() => handleDelete(photo.id)}
                  className="bg-clay/90 text-cream text-xs font-medium px-2 py-1 rounded-full active:scale-95 disabled:opacity-50"
                >
                  {deletingId === photo.id ? "..." : "Hapus"}
                </button>
              </div>
            </div>
          ) : (
            <button
              key={i}
              type="button"
              disabled={uploading}
              onClick={triggerAdd}
              className={clsx(
                "aspect-square rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 text-espresso-soft hover:border-coffee-light hover:text-coffee transition active:scale-95",
                uploading && "opacity-50"
              )}
            >
              <span className="text-2xl">{uploading ? "⏳" : "📷"}</span>
              <span className="text-[11px] font-medium">
                {uploading ? "Mengupload..." : "Tambah"}
              </span>
            </button>
          )
        )}
      </div>
      {error && <p className="text-clay text-sm mt-2">{error}</p>}
    </div>
  );
}
