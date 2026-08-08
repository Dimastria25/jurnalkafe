export const SEATING_OPTIONS = [
  { value: "INDOOR", label: "Indoor" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "SEMI_OUTDOOR", label: "Semi-outdoor" },
] as const;

export const AMBIENCE_OPTIONS = [
  { value: "CLASSIC_ELEGANT", label: "Classic & elegan", emoji: "🏛️" },
  { value: "CASUAL_RELAXED", label: "Santai & kasual", emoji: "🌿" },
  { value: "WORK_FRIENDLY", label: "Tempat nugas/kerja", emoji: "📚" },
  { value: "LIVELY_HANGOUT", label: "Ramai & hangout", emoji: "🎉" },
  { value: "INSTAGRAMABLE", label: "Instagramable", emoji: "📸" },
  { value: "SPECIALTY_COFFEE", label: "Specialty coffee", emoji: "☕" },
] as const;

export const POWER_OPTIONS = [
  { value: "ADA", label: "Ada" },
  { value: "TERBATAS", label: "Terbatas" },
  { value: "TIDAK_ADA", label: "Tidak ada" },
] as const;

export const WFC_OPTIONS = [
  { value: "YA", label: "Ya" },
  { value: "LUMAYAN", label: "Lumayan" },
  { value: "TIDAK", label: "Tidak" },
] as const;

export const ACCESS_OPTIONS = [
  { value: "MUDAH", label: "Mudah" },
  { value: "SEDANG", label: "Sedang" },
  { value: "SUSAH", label: "Susah" },
] as const;

export function labelFor<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function ambienceEmoji(value: string): string {
  return AMBIENCE_OPTIONS.find((o) => o.value === value)?.emoji ?? "";
}

export const MAX_PHOTOS_PER_CAFE = 3;
