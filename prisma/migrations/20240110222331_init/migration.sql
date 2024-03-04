-- CreateTable
CREATE TABLE "users" (
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(64) NOT NULL,
    "first_name" VARCHAR(35) NOT NULL,
    "last_name" VARCHAR(35) NOT NULL,
    "last_login" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "phone_number" VARCHAR(15),

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "profiles" (
    "age" INTEGER NOT NULL,
    "bio" VARCHAR(250) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "traits" VARCHAR(64)[],
    "email" VARCHAR(64) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "matches" (
    "eventId" TEXT NOT NULL,
    "userEmail" VARCHAR(64) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("userEmail","eventId")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(250) NOT NULL,
    "payment" INTEGER,
    "type" VARCHAR(64)[],
    "host_email" VARCHAR(64) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_host_email_fkey" FOREIGN KEY ("host_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
