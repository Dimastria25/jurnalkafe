import { upload } from "@vercel/blob/client";
import imageCompression from "browser-image-compression";

export async function compressPhoto(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxWidthOrHeight: 1600,
      maxSizeMB: 1.2,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.82,
    });
  } catch {
    // If compression fails for any reason, fall back to the original file
    // rather than blocking the upload entirely.
    return file;
  }
}

export async function uploadCafePhoto(cafeId: string, file: File) {
  const compressed = await compressPhoto(file);
  const filename = `cafe-${cafeId}-${Date.now()}.webp`;

  const blob = await upload(filename, compressed, {
    access: "public",
    handleUploadUrl: "/api/photos/upload",
    clientPayload: cafeId,
  });

  const res = await fetch(`/api/cafes/${cafeId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: blob.url, pathname: blob.pathname }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Gagal menyimpan foto");
  }

  return res.json();
}
