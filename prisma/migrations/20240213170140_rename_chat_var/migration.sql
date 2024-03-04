/*
  Warnings:

  - You are about to drop the column `recipeint` on the `messages` table. All the data in the column will be lost.
  - Added the required column `recipient` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "recipeint",
ADD COLUMN     "recipient" TEXT NOT NULL;
