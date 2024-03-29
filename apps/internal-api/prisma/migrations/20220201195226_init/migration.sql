-- CreateTable
CREATE TABLE "webhooks" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "mention" BIGINT,
    "guild" BIGINT NOT NULL,
    "channel" BIGINT NOT NULL,
    "blacklist" TEXT[],
    "keywords" TEXT[],

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" INT GENERATED BY DEFAULT AS IDENTITY,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reddit_id" TEXT NOT NULL,
    "reddit_title" TEXT NOT NULL,
    "game_url" TEXT NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhooks_id_key" ON "webhooks"("id");

-- CreateIndex
CREATE INDEX "webhooks_guild_idx" ON "webhooks"("guild");

-- CreateIndex
CREATE UNIQUE INDEX "deals_reddit_id_key" ON "deals"("reddit_id");
