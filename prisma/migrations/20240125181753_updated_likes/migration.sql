/*
  Warnings:

  - Added the required column `event_likes` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_likes` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "event_likes" BOOLEAN NOT NULL,
ADD COLUMN     "user_likes" BOOLEAN NOT NULL;
