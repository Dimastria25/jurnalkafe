"use client";

import { useState, type FormEvent } from "react";
import { StarPicker } from "./StarRating";
import { ChipMultiSelect, ChipSingleSelect } from "./ChipSelector";
import {
  ACCESS_OPTIONS,
  AMBIENCE_OPTIONS,
  POWER_OPTIONS,
  SEATING_OPTIONS,
  WFC_OPTIONS,
} from "@/lib/options";
import type { CafeInput } from "@/lib/validation";

export type CafeFormValues = CafeInput;

const emptyValues: CafeFormValues = {
  name: "",
  rating: 0,
  mapsUrl: "",
  visitDate: new Date(),
  seating: [],
  menuNotes: "",
  ambienceTags: [],
  ambienceNotes: "",
  powerOutlet: "TIDAK_ADA",
  wfcRating: "TIDAK",
  accessLevel: "SEDANG",
  accessNotes: "",
  additionalNotes: "",
};

function toDateInputValue(d: Date | string) {
  const date = new Date(d);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function CafeForm({
  initial,
  onSubmit,
  submitLabel = "Simpan Kafe",
  submitting = false,
}: {
  initial?: Partial<CafeFormValues>;
  onSubmit: (values: CafeFormValues) => void | Promise<void>;
  submitLabel?: string;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<CafeFormValues>({
    ...emptyValues,
    ...initial,
  });
  const [error, setError] = useState("");

  function set<K extends keyof CafeFormValues>(key: K, value: CafeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!values.name.trim()) {
      setError("Nama kafe wajib diisi.");
      return;
    }
    if (!values.rating) {
      setError("Kasih rating dulu ya, minimal 1 bintang.");
      return;
    }
    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Nama Kafe *
        </label>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="mis. Kopi Anjis, Filosofi Kopi..."
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-espresso placeholder:text-espresso-soft/50 outline-none focus:ring-2 focus:ring-crema transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Rating Rekomendasi *
        </label>
        <StarPicker value={values.rating} onChange={(v) => set("rating", v)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-espresso mb-1.5">
            Tanggal Kunjungan
          </label>
          <input
            type="date"
            value={toDateInputValue(values.visitDate)}
            onChange={(e) => set("visitDate", new Date(e.target.value))}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-espresso outline-none focus:ring-2 focus:ring-crema transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-espresso mb-1.5">
            Link Google Maps
          </label>
          <input
            value={values.mapsUrl ?? ""}
            onChange={(e) => set("mapsUrl", e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-espresso placeholder:text-espresso-soft/50 outline-none focus:ring-2 focus:ring-crema transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Kondisi Tempat
        </label>
        <ChipMultiSelect
          options={SEATING_OPTIONS}
          value={values.seating}
          onChange={(v) => set("seating", v as CafeFormValues["seating"])}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Menu Favorit / Pernah Dicoba
        </label>
        <textarea
          value={values.menuNotes ?? ""}
          onChange={(e) => set("menuNotes", e.target.value)}
          rows={3}
          placeholder={"Kopi Susu Gula Aren\nCroissant Almond"}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-espresso placeholder:text-espresso-soft/50 outline-none focus:ring-2 focus:ring-crema transition resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Ambience / Vibe
        </label>
        <ChipMultiSelect
          options={AMBIENCE_OPTIONS}
          value={values.ambienceTags}
          onChange={(v) => set("ambienceTags", v as CafeFormValues["ambienceTags"])}
        />
        <textarea
          value={values.ambienceNotes ?? ""}
          onChange={(e) => set("ambienceNotes", e.target.value)}
          rows={2}
          placeholder="Catatan tambahan soal vibe, mis. 'santai siang hari, ramai anak kuliah sore-malam'"
          className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-espresso placeholder:text-espresso-soft/50 outline-none focus:ring-2 focus:ring-crema transition resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Colokan Listrik
        </label>
        <ChipSingleSelect
          options={POWER_OPTIONS}
          value={values.powerOutlet}
          onChange={(v) => set("powerOutlet", v as CafeFormValues["powerOutlet"])}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Cocok untuk WFC
        </label>
        <ChipSingleSelect
          options={WFC_OPTIONS}
          value={values.wfcRating}
          onChange={(v) => set("wfcRating", v as CafeFormValues["wfcRating"])}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Akses / Rute ke Lokasi
        </label>
        <ChipSingleSelect
          options={ACCESS_OPTIONS}
          value={values.accessLevel}
          onChange={(v) => set("accessLevel", v as CafeFormValues["accessLevel"])}
        />
        <textarea
          value={values.accessNotes ?? ""}
          onChange={(e) => set("accessNotes", e.target.value)}
          rows={2}
          placeholder="mis. 'gang sempit, GPS suka salah arah'"
          className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-espresso placeholder:text-espresso-soft/50 outline-none focus:ring-2 focus:ring-crema transition resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-espresso mb-1.5">
          Catatan Tambahan
        </label>
        <textarea
          value={values.additionalNotes ?? ""}
          onChange={(e) => set("additionalNotes", e.target.value)}
          rows={3}
          placeholder="Catatan bebas lainnya..."
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-espresso placeholder:text-espresso-soft/50 outline-none focus:ring-2 focus:ring-crema transition resize-y"
        />
      </div>

      {error && <p className="text-clay text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-coffee text-cream font-semibold py-3.5 rounded-2xl active:scale-95 hover:bg-espresso-soft transition disabled:opacity-50 disabled:active:scale-100"
      >
        {submitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
