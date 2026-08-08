"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CafeForm, type CafeFormValues } from "@/components/CafeForm";

export default function NewCafePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values: CafeFormValues) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/cafes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan kafe");
      }
      const cafe = await res.json();
      router.push(`/cafe/${cafe.id}?new=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 px-4 sm:px-6 max-w-2xl w-full mx-auto pb-16 pt-6">
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/"
          className="text-espresso-soft hover:text-espresso text-xl leading-none active:scale-90 transition"
          aria-label="Kembali"
        >
          ←
        </Link>
        <h1 className="font-display text-2xl font-bold text-espresso">
          Tambah Kafe Baru
        </h1>
      </div>
      <p className="text-sm text-espresso-soft mb-6">
        Isi dulu detailnya. Foto bisa diupload setelah kafe tersimpan.
      </p>
      {error && (
        <p className="text-clay bg-clay/10 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </p>
      )}
      <CafeForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Simpan & Lanjut Upload Foto" />
    </main>
  );
}
