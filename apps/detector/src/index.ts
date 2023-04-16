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

const detector = new Detector(gamesDeals, redditClient);

async function main() {
  // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention, no-underscore-dangle
  for await (const _x of setInterval(config.interval)) {
    try {
      await detector.detect();
    } catch (e) {
      logger.error(e, 'Game detection failed');
    }
  }
}
//
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
