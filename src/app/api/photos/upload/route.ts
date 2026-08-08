import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MAX_PHOTOS_PER_CAFE } from "@/lib/options";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const cafeId = clientPayload;
        if (!cafeId) {
          throw new Error("cafeId wajib disertakan");
        }
        const cafe = await prisma.cafe.findUnique({
          where: { id: cafeId },
          select: { _count: { select: { photos: true } } },
        });
        if (!cafe) {
          throw new Error("Kafe tidak ditemukan");
        }
        if (cafe._count.photos >= MAX_PHOTOS_PER_CAFE) {
          throw new Error(`Maksimal ${MAX_PHOTOS_PER_CAFE} foto per kafe`);
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: cafeId,
        };
      },
      onUploadCompleted: async () => {
        // Photo rows are created explicitly by the client via
        // POST /api/cafes/[id]/photos after the upload resolves, so we
        // don't duplicate that here (this webhook is unreliable in local dev).
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gagal" },
      { status: 400 }
    );
  }
}
