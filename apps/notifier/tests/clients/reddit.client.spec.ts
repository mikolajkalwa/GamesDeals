import redditClientFixture from '../fixtures/reddit-client.fixture.json';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { ZodError } from 'zod';
import { RedditClient } from '../../src/clients';

const REDDIT_BASE_URL = 'https://reddit.com';
const GAME_DEALS_PART_URL = '/r/GameDeals/hot/.json?limit=3';
const FULL_URL = `${REDDIT_BASE_URL}${GAME_DEALS_PART_URL}`;

const mockAgent = new MockAgent();
const mockPool = mockAgent.get(REDDIT_BASE_URL);
setGlobalDispatcher(mockAgent);

describe('RedditClient', () => {
  let redditClient: RedditClient;
  
  beforeEach(() => {
    redditClient = new RedditClient(REDDIT_BASE_URL);
  })

  describe('getTrendingDeals', () => {
    test('should throw an error if reddit api response does not fulfill schema', async () => {
      mockPool.intercept({
        path: FULL_URL,
        method: 'GET'
      }).reply(200, {})

      await expect(redditClient.getTrendingDeals()).rejects.toThrowError(ZodError);
    });
    
    test('should map reddit response to defined object', async () => {    
      mockPool.intercept({
        path: FULL_URL,
        method: 'GET'
      }).reply(200, redditClientFixture)
    
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
  })
})
