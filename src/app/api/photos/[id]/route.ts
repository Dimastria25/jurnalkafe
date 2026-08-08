import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) {
    return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
  }

  await del(photo.url).catch(() => {});
  await prisma.photo.delete({ where: { id } });

  const remaining = await prisma.photo.findMany({
    where: { cafeId: photo.cafeId },
    orderBy: { order: "asc" },
  });
  await Promise.all(
    remaining.map((p, index) =>
      p.order === index
        ? Promise.resolve()
        : prisma.photo.update({ where: { id: p.id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
