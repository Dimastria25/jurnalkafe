-- CreateEnum
CREATE TYPE "SeatingType" AS ENUM ('INDOOR', 'OUTDOOR', 'SEMI_OUTDOOR');

-- CreateEnum
CREATE TYPE "AmbienceTag" AS ENUM ('CLASSIC_ELEGANT', 'CASUAL_RELAXED', 'WORK_FRIENDLY', 'LIVELY_HANGOUT', 'INSTAGRAMABLE', 'SPECIALTY_COFFEE');

-- CreateEnum
CREATE TYPE "PowerOutlet" AS ENUM ('ADA', 'TERBATAS', 'TIDAK_ADA');

-- CreateEnum
CREATE TYPE "WfcRating" AS ENUM ('YA', 'LUMAYAN', 'TIDAK');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('MUDAH', 'SEDANG', 'SUSAH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cafe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "mapsUrl" TEXT,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "seating" "SeatingType"[],
    "menuNotes" TEXT,
    "ambienceTags" "AmbienceTag"[],
    "ambienceNotes" TEXT,
    "powerOutlet" "PowerOutlet" NOT NULL DEFAULT 'TIDAK_ADA',
    "wfcRating" "WfcRating" NOT NULL DEFAULT 'TIDAK',
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'SEDANG',
    "accessNotes" TEXT,
    "additionalNotes" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cafe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cafe_visitDate_idx" ON "Cafe"("visitDate");

-- CreateIndex
CREATE INDEX "Cafe_name_idx" ON "Cafe"("name");

-- CreateIndex
CREATE INDEX "Photo_cafeId_idx" ON "Photo"("cafeId");

-- AddForeignKey
ALTER TABLE "Cafe" ADD CONSTRAINT "Cafe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
