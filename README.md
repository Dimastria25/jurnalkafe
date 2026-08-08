# Jurnal Kafe Bandung ☕

Jurnal pribadi (untuk berdua) untuk mencatat kafe-kafe yang pernah dikunjungi di Bandung: rating, vibe, colokan, cocok WFC atau tidak, foto, dan catatan lainnya.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (Neon / Vercel Postgres / Supabase, dll)
- Vercel Blob untuk penyimpanan foto
- Gate akses dengan satu shared password (cookie session, bukan akun individual)

## Setup lokal

1. Salin `.env.example` menjadi `.env` dan isi:
   - `DATABASE_URL` — connection string Postgres
   - `BLOB_READ_WRITE_TOKEN` — token dari Vercel Blob storage (opsional untuk dev tanpa upload foto)
   - `ACCESS_PASSWORD` — kode akses bersama untuk masuk ke web
   - `SESSION_SECRET` — string acak untuk menandatangani cookie sesi

2. Install dependency & siapkan database:

   ```bash
   npm install
   npx prisma migrate dev
   ```

3. Jalankan dev server:

   ```bash
   npm run dev
   ```

## Deploy ke Vercel

1. Buat project Postgres (Neon / Vercel Postgres) dan Vercel Blob store dari dashboard Vercel.
2. Set environment variables di Vercel project settings: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ACCESS_PASSWORD`, `SESSION_SECRET`.
3. Jalankan migrasi terhadap database production (mis. `npx prisma migrate deploy` dengan `DATABASE_URL` production di environment lokal, atau melalui build step).
4. Deploy:

   ```bash
   vercel --prod
   ```

## Catatan skema

Tabel `Cafe` punya kolom `authorId` opsional yang menunjuk ke tabel `User`, walaupun untuk versi ini tidak ada login individual — ini disiapkan supaya suatu saat aplikasi bisa diupgrade ke sistem akun per-orang tanpa perlu mendesain ulang skema data.
