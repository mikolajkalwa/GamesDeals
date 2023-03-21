import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  urls: {
    webhook: process.env['WEBHOOK_URL'],
    discord: process.env['DISCORD_URL'] || 'https://discord.com',
    reddit: process.env['REDDIT_URL'] || 'https://reddit.com',
    gamesDeals: process.env['GAMES_DEALS_API_URL'] || 'http://127.0.0.1:3000',
  },
  logLevel: process.env['LOG_LEVEL'] || 'debug',
};
