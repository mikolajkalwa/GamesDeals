import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  urls: {
    reddit: process.env['REDDIT_URL'] ?? 'https://reddit.com',
    gamesDeals: process.env['GAMES_DEALS_API_URL'] ?? 'http://127.0.0.1:3000',
  },
  interval: Number(process.env['INTERVAL']) || 15 * 60 * 1000,
  logLevel: process.env['LOG_LEVEL'] ?? 'debug',
};
