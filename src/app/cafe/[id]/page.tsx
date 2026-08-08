import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CafeDetailClient } from "./CafeDetailClient";

export default async function CafeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cafe = await prisma.cafe.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!cafe) notFound();

  return <CafeDetailClient cafe={cafe} />;
}
