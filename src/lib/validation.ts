import { z } from "zod";

export const cafeInputSchema = z.object({
  name: z.string().trim().min(1, "Nama kafe wajib diisi").max(200),
  rating: z.number().int().min(1).max(5),
  mapsUrl: z.string().trim().max(2000).optional().nullable(),
  visitDate: z.coerce.date(),
  seating: z.array(z.enum(["INDOOR", "OUTDOOR", "SEMI_OUTDOOR"])).default([]),
  menuNotes: z.string().trim().max(4000).optional().nullable(),
  ambienceTags: z
    .array(
      z.enum([
        "CLASSIC_ELEGANT",
        "CASUAL_RELAXED",
        "WORK_FRIENDLY",
        "LIVELY_HANGOUT",
        "INSTAGRAMABLE",
        "SPECIALTY_COFFEE",
      ])
    )
    .default([]),
  ambienceNotes: z.string().trim().max(2000).optional().nullable(),
  powerOutlet: z.enum(["ADA", "TERBATAS", "TIDAK_ADA"]).default("TIDAK_ADA"),
  wfcRating: z.enum(["YA", "LUMAYAN", "TIDAK"]).default("TIDAK"),
  accessLevel: z.enum(["MUDAH", "SEDANG", "SUSAH"]).default("SEDANG"),
  accessNotes: z.string().trim().max(2000).optional().nullable(),
  additionalNotes: z.string().trim().max(4000).optional().nullable(),
});

export type CafeInput = z.infer<typeof cafeInputSchema>;
