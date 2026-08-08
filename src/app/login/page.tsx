"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Gagal masuk.");
        setLoading(false);
        return;
      }
      const next = params.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream bg-noise px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-paper rounded-3xl shadow-xl shadow-espresso/10 border border-line p-8 animate-bounce-in"
      >
        <div className="text-5xl mb-3 text-center">☕</div>
        <h1 className="font-display text-2xl font-semibold text-center text-espresso mb-1">
          Jurnal Kafe Bandung
        </h1>
        <p className="text-sm text-espresso-soft text-center mb-6">
          Masukkan kode akses untuk melihat catatan kafe kalian berdua.
        </p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Kode akses"
          className="w-full rounded-xl border border-line bg-cream-soft px-4 py-3 text-espresso placeholder:text-espresso-soft/60 outline-none focus:ring-2 focus:ring-crema transition"
        />
        {error && (
          <p className="text-clay text-sm mt-2 animate-pop-in">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-xl bg-coffee text-cream font-semibold py-3 transition active:scale-95 hover:bg-espresso-soft disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? "Membuka pintu..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
