-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('GUILD_TEXT', 'GUILD_FORUM');

-- AlterTable
ALTER TABLE "webhooks" ADD COLUMN     "channel_type" "Channel" NOT NULL DEFAULT 'GUILD_TEXT';
