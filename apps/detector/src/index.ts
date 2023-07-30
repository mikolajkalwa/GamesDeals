import { GamesDealsApiClient } from 'gd-api-client';
import { setInterval } from 'node:timers/promises';
import pino from 'pino';
import { config } from './config';
import { Detector } from './detector/detector';
import { RedditClient } from './reddit/reddit.client';

const logger = pino({
  level: config.logLevel,
});

const redditClient = new RedditClient(config.urls.reddit);
const gamesDeals = new GamesDealsApiClient(config.urls.gamesDeals);

const detector = new Detector(gamesDeals, redditClient, logger);

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const _x of setInterval(config.interval)) {
    try {
      await detector.detect();
    } catch (e) {
      logger.error(e, 'Game detection failed');
      process.exit(1);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
