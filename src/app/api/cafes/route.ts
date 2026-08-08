import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cafeInputSchema } from "@/lib/validation";
import type {
  AmbienceTag,
  Prisma,
  SeatingType,
} from "@/generated/prisma";

const AMBIENCE_VALUES: readonly string[] = [
  "CLASSIC_ELEGANT",
  "CASUAL_RELAXED",
  "WORK_FRIENDLY",
  "LIVELY_HANGOUT",
  "INSTAGRAMABLE",
  "SPECIALTY_COFFEE",
];
const SEATING_VALUES: readonly string[] = [
  "INDOOR",
  "OUTDOOR",
  "SEMI_OUTDOOR",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const wfc = searchParams.get("wfc");
  const ambience = searchParams.getAll("ambience");
  const seating = searchParams.getAll("seating");

  const where: Prisma.CafeWhereInput = {};

  if (query) {
    where.name = { contains: query, mode: "insensitive" };
  }
  if (wfc === "YA" || wfc === "LUMAYAN" || wfc === "TIDAK") {
    where.wfcRating = wfc;
  }
  const validAmbience = ambience.filter((a) =>
    AMBIENCE_VALUES.includes(a)
  ) as AmbienceTag[];
  if (validAmbience.length > 0) {
    where.ambienceTags = { hasSome: validAmbience };
  }

  const validSeating = seating.filter((s) =>
    SEATING_VALUES.includes(s)
  ) as SeatingType[];
  if (validSeating.length > 0) {
    where.seating = { hasSome: validSeating };
  }

  const cafes = await prisma.cafe.findMany({
    where,
    include: { photos: { orderBy: { order: "asc" } } },
    orderBy: { visitDate: "desc" },
  });

  return NextResponse.json(cafes);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = cafeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cafe = await prisma.cafe.create({
    data: parsed.data,
    include: { photos: true },
  });

  return NextResponse.json(cafe, { status: 201 });
}
