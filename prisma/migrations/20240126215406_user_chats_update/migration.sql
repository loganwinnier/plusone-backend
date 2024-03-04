/*
  Warnings:

  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `liked_event_id` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `likes_event_id` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_liked_event_id_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "userEmail" VARCHAR(64);

-- AlterTable
ALTER TABLE "likes" DROP CONSTRAINT "likes_pkey",
DROP COLUMN "liked_event_id",
ADD COLUMN     "likes_event_id" TEXT NOT NULL,
ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("likes_event_id", "user_email");

-- DropTable
DROP TABLE "_ChatToUser";

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_likes_event_id_fkey" FOREIGN KEY ("likes_event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_one_email_fkey" FOREIGN KEY ("user_one_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_two_email_fkey" FOREIGN KEY ("user_two_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
