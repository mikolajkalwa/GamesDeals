import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  urls: {
    discord: process.env['DISCORD_URL'] || 'https://discord.com',
    gamesDeals: process.env['GAMES_DEALS_API_URL'] || 'http://127.0.0.1:3000',
  },
  redis: {
    host: process.env['REDIS_HOST'] || 'localhost',
    port: Number(process.env['REDIS_PORT']) || 6379,
  },
  logLevel: process.env['LOG_LEVEL'] || 'debug',
};
