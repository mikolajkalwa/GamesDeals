import { MockAgent, setGlobalDispatcher } from 'undici';
import { GamesDealsApiClient } from '../../src/clients';
 
const gamesDealsAPIClient = new GamesDealsApiClient('http://localhost');

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get('http://localhost');

describe('removeWebhook', () => {
  it('should return true if games deals api returns status code 204', async () => {
    mockPool.intercept({
      path: '/webhooks/1234',
      method: 'DELETE'
    }).reply(204)

    await expect(gamesDealsAPIClient.removeWebhook({ id: '1234' })).resolves.toBe(true)
  })

  it('should return false if games deals api returns non 204 status code', async () => {
    mockPool.intercept({
      path: '/webhooks/1234',
      method: 'DELETE'
    }).reply(404)

    await expect(gamesDealsAPIClient.removeWebhook({ id: '1234' })).resolves.toBe(false)
  })
})
