/*
  Warnings:

  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userEmail` on the `matches` table. All the data in the column will be lost.
  - Added the required column `guestEmail` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_userEmail_fkey";

-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
DROP COLUMN "userEmail",
ADD COLUMN     "guestEmail" VARCHAR(64) NOT NULL,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("guestEmail", "eventId");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_guestEmail_fkey" FOREIGN KEY ("guestEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
