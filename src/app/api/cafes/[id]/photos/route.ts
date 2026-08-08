import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { MAX_PHOTOS_PER_CAFE } from "@/lib/options";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: cafeId } = await params;
  const { url, pathname } = await req.json().catch(() => ({}));

  if (!url || !pathname) {
    return NextResponse.json({ error: "url dan pathname wajib" }, { status: 400 });
  }

  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    include: { photos: true },
  });
  if (!cafe) {
    return NextResponse.json({ error: "Kafe tidak ditemukan" }, { status: 404 });
  }
  if (cafe.photos.length >= MAX_PHOTOS_PER_CAFE) {
    await del(url).catch(() => {});
    return NextResponse.json(
      { error: `Maksimal ${MAX_PHOTOS_PER_CAFE} foto per kafe` },
      { status: 400 }
    );
  }

  const photo = await prisma.photo.create({
    data: {
      cafeId,
      url,
      pathname,
      order: cafe.photos.length,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}
