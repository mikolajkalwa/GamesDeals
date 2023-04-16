import { MockAgent, setGlobalDispatcher } from 'undici';
import { GamesDealsApiClient } from '../src';

const client = new GamesDealsApiClient('http://localhost');

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get('http://localhost');

describe('isNewDeal', () => {
  it('should return false if games deals api returns non 404 status for given thread id', async () => {
    mockPool.intercept({
      path: '/deals/reddit/thread-id',
      method: 'GET'
    }).reply(200, {})
    await expect(client.deal.isNew('thread-id')).resolves.toBe(false);
  })
  it('should return true if games deals api returns 404 status for given thread id', async () => {
    mockPool.intercept({
      path: '/deals/reddit/thread-id',
      method: 'GET'
    }).reply(404, {})
    await expect(client.deal.isNew('thread-id')).resolves.toBe(true);
  })
});
