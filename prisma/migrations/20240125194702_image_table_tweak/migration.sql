/*
  Warnings:

  - You are about to drop the column `userEmail` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_event_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_profileEmail_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_liked_event_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_email_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "userEmail";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "event_id" DROP NOT NULL,
ALTER COLUMN "user_email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_liked_event_id_fkey" FOREIGN KEY ("liked_event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_profileEmail_fkey" FOREIGN KEY ("profileEmail") REFERENCES "profiles"("email") ON DELETE CASCADE ON UPDATE CASCADE;
