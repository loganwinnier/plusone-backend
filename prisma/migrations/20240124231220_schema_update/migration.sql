/*
  Warnings:

  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `matches` table. If the table is not empty, all the data it contains will be lost.
  - The required column `event_id` was added to the `events` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_eventId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_guestEmail_fkey";

-- AlterTable
ALTER TABLE "events" DROP CONSTRAINT "events_pkey",
DROP COLUMN "id",
ADD COLUMN     "chat_ids" TEXT[],
ADD COLUMN     "event_id" TEXT NOT NULL,
ADD CONSTRAINT "events_pkey" PRIMARY KEY ("event_id");

-- DropTable
DROP TABLE "matches";

-- CreateTable
CREATE TABLE "likes" (
    "liked_event_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("liked_event_id","user_email")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message" TIMESTAMP(3),
    "event_ids" TEXT[],
    "user_one_email" TEXT NOT NULL,
    "user_two_email" TEXT NOT NULL,
    "userEmail" VARCHAR(64),

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" SERIAL NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "recipeint" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" VARCHAR(160) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "profileEmail" VARCHAR(64),

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatToUser" (
    "A" TEXT NOT NULL,
    "B" VARCHAR(64) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "chats_user_one_email_user_two_email_key" ON "chats"("user_one_email", "user_two_email");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToEvent_AB_unique" ON "_ChatToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToEvent_B_index" ON "_ChatToEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToUser_AB_unique" ON "_ChatToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_liked_event_id_fkey" FOREIGN KEY ("liked_event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_profileEmail_fkey" FOREIGN KEY ("profileEmail") REFERENCES "profiles"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToEvent" ADD CONSTRAINT "_ChatToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToEvent" ADD CONSTRAINT "_ChatToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
