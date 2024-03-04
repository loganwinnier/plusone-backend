/*
  Warnings:

  - Added the required column `city` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "city" VARCHAR(50) NOT NULL,
ADD COLUMN     "geo_location" DOUBLE PRECISION[],
ADD COLUMN     "state" VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "city" VARCHAR(50) NOT NULL,
ADD COLUMN     "geo_location" DOUBLE PRECISION[],
ADD COLUMN     "state" VARCHAR(40) NOT NULL;
