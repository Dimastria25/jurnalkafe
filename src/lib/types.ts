import type { Cafe, Photo } from "@/generated/prisma";

export type CafeWithPhotos = Cafe & { photos: Photo[] };
