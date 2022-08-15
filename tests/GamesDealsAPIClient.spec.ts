import { MockAgent, setGlobalDispatcher } from 'undici';
import GamesDealsAPIClient from '../src/GamesDealsAPIClient';

const gamesDealsAPIClient = new GamesDealsAPIClient('http://localhost');

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get('http://localhost');

describe('isNewDeal', () => {
  it('should return false if games deals api returns non 404 status for given thread id', async () => {
    mockPool.intercept({
      path: '/deals/reddit/thread-id',
      method: 'GET'
    }).reply(200, {})
    await expect(gamesDealsAPIClient.isNewDeal('thread-id')).resolves.toBe(false);
  })
  it('should return true if games deals api returns 404 status for given thread id', async () => {
    mockPool.intercept({
      path: '/deals/reddit/thread-id',
      method: 'GET'
    }).reply(404, {})
    await expect(gamesDealsAPIClient.isNewDeal('thread-id')).resolves.toBe(true);
  })
})

describe('insertNewDeal', () => {
  it('should throw an error if games deals api returns non 201 response', async () => {
    mockPool.intercept({
      path: '/deals',
      method: 'POST'
    }).reply(400, ['redditId should not be empty'])

    await expect(gamesDealsAPIClient.insertNewDeal({
      id: '',
      title: '[Steam] Metro 2033 (Free/100% off)',
      url: 'https://store.steampowered.com/app/43110/Metro_2033/',
    })).rejects.toThrow('[\"redditId should not be empty\"]')
  })
})

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
