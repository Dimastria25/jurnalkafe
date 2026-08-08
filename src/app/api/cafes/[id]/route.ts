import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { cafeInputSchema } from "@/lib/validation";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cafe = await prisma.cafe.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!cafe) {
    return NextResponse.json({ error: "Kafe tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(cafe);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = cafeInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.cafe.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Kafe tidak ditemukan" }, { status: 404 });
  }

  const cafe = await prisma.cafe.update({
    where: { id },
    data: parsed.data,
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(cafe);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cafe = await prisma.cafe.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!cafe) {
    return NextResponse.json({ error: "Kafe tidak ditemukan" }, { status: 404 });
  }

  await Promise.allSettled(cafe.photos.map((p) => del(p.url)));
  await prisma.cafe.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
