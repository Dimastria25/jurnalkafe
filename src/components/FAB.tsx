"use client";

import Link from "next/link";

export function FAB() {
  return (
    <Link
      href="/cafe/new"
      aria-label="Tambah kafe baru"
      className="fixed bottom-6 right-5 z-30 flex items-center gap-2 bg-clay text-cream font-semibold rounded-full shadow-xl shadow-clay/30 pl-4 pr-5 py-3.5 active:scale-90 hover:scale-105 transition-transform"
    >
      <span className="text-xl leading-none">+</span>
      <span className="hidden sm:inline">Tambah Kafe</span>
    </Link>
  );
}
