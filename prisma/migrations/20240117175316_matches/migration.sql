/*
  Warnings:

  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[guestEmail,eventId]` on the table `matches` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `matches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_guestEmail_eventId_key" ON "matches"("guestEmail", "eventId");
