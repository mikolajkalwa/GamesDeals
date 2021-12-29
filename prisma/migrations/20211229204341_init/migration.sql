-- CreateTable
CREATE TABLE "webhooks" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "role" BIGINT,
    "guild" BIGINT NOT NULL,
    "channel" BIGINT NOT NULL,
    "blacklist" TEXT[],
    "keywords" TEXT[],

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reddit_id" VARCHAR(63) NOT NULL,
    "reddit_title" VARCHAR(300) NOT NULL,
    "game_url" VARCHAR(2083) NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhooks_id_key" ON "webhooks"("id");

-- CreateIndex
CREATE INDEX "webhooks_id_idx" ON "webhooks"("id");

-- CreateIndex
CREATE INDEX "webhooks_guild_idx" ON "webhooks"("guild");

-- CreateIndex
CREATE UNIQUE INDEX "deals_reddit_id_key" ON "deals"("reddit_id");

-- CreateIndex
CREATE INDEX "deals_reddit_id_idx" ON "deals"("reddit_id");
