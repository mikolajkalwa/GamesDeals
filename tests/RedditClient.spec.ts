import fs from 'fs/promises';
import path from 'path';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { ZodError } from 'zod';
import RedditClient from '../src/RedditClient';

const redditClient = new RedditClient('https://reddit.com');

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get('https://reddit.com');

test('getTrendingDeals should throw an error if reddit api response does not fulfill schema', async () => {
  mockPool.intercept({
    path: '/r/GameDeals/hot/.json?limit=3',
    method: 'GET'
  }).reply(200, {})

  await expect(redditClient.getTrendingDeals()).rejects.toBeInstanceOf(ZodError);
});

test('getTrendingDeals should strip extra properties and resolve to defined object', async () => {
  const fixture = await fs.readFile(path.resolve(__dirname, 'RedditClient.fixture.json'), { encoding: 'utf-8' });

  mockPool.intercept({
    path: '/r/GameDeals/hot/.json?limit=3',
    method: 'GET'
  }).reply(200, JSON.parse(fixture))

  await expect(redditClient.getTrendingDeals()).resolves.toEqual([
    {
      id: 'ug1ppc',
      url: 'https://www.fanatical.com/en/game/victor-vran-arpg',
      title: '[Fanatical] Victor Vran ARPG (87% off - $2.59 / \u00a31.99 / \u20ac2.59) 48 Hour Star Deal',
      author: 'WeAreFanatical',
      over18: false
    },
    {
      id: 'ufw46z',
      url: 'https://www.reddit.com/r/GameDeals/comments/ufw46z/gamesplanet_spring_sale_encore_day_monster_hunter/',
      title: '[Gamesplanet] SPRING SALE Encore Day: Monster Hunter Rise (-53%), Assassins Creed Valhalla (-63%), NARUTO TO BORUTO: SHINOBI STRIKER (-95%), Devil May Cry 5 (-63%), Tales of Arise (-50%), TEKKEN 7 (-87%), Batman: Arkham Collection (-80%), Anno 1800 (-70%), Metro Exodus (-63%) &amp; more | Various DRM',
      author: 'Gamesplanet',
      over18: false
    },
    {
      id: 'ug2oqo',
      url: 'https://www.indiegala.com/store/publisher-sale/shiro-games',
      title: '[IndieGala] Shiro Games Sale: Northgard (60%), Wartales (10%), Darksburg (75%), Evoland Legendary Edition (80%), Northgard Expansions: Svardilfari, Lyngbakr, Himminbrjotir, Ratatoskr, Sv\u00e1fnir, Nidhogg, Brundr &amp; Kaelinn (50%) | Crypto Sale Bonus Discount',
      author: 'indieg',
      over18: false
    }
  ]);
});
