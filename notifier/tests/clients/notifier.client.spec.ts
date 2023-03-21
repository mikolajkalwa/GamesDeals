import pino from 'pino';
import { DiscordClient, GamesDealsApiClient, NotifierClient } from '../../src/clients';
import { epic, gog, indiegala, itchio, steam, webhooks } from '../fixtures/notifier-client.fixture';

jest.mock('../../src/clients/games-deals-api.client.ts');
const gdApiMock = jest.mocked(new GamesDealsApiClient('http://localhost'), { shallow: true });

let notifier: NotifierClient;

beforeEach(() => {
  jest.clearAllMocks();
  notifier = new NotifierClient(pino(), gdApiMock, new DiscordClient('http://localhost'));
});

describe('getWebhooksToExecute', () => {
  test('Get webhooks for steam deal', () => {
    const result = notifier.getWebhooksToExecute(steam, webhooks);
    expect(result).toEqual([
      {
        blacklist: [],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['INDIEGALA'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: ['steam'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: ['steam', 'epic'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['steam'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['Steam'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic', 'gog'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['gog', 'epic'],
        keywords: ['steam'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['STEAM'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
    ]);
  });

  test('Get webhooks for indiegala deal', () => {
    const result = notifier.getWebhooksToExecute(indiegala, webhooks);
    expect(result).toEqual([
      {
        blacklist: [],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
    ]);
  });

  test('Get webhooks for epic deal', () => {
    const result = notifier.getWebhooksToExecute(epic, webhooks);
    expect(result).toEqual([
      {
        blacklist: [],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['INDIEGALA'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: ['steam', 'epic'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['epic'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic', 'gog'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
    ]);
  });

  test('Get webhooks for itchio deal', () => {
    const result = notifier.getWebhooksToExecute(itchio, webhooks);
    expect(result).toEqual([
      {
        blacklist: [],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['INDIEGALA'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
    ]);
  });

  test('Get webhooks for gog deal', () => {
    const result = notifier.getWebhooksToExecute(gog, webhooks);
    expect(result).toEqual([
      {
        blacklist: [],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['INDIEGALA'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: [],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic', 'gog'],
        guild: '',
        id: '',
        token: '',
        channelType: 'GUILD_TEXT'
      },
    ]);
  });

});

describe('getDealsToAnnounce', () => {
  it('over18 deals should be ignored', async () => {
    gdApiMock.isNewDeal.mockResolvedValue(true)
    await expect(notifier.getDealsToAnnounce([{ author: '', id: '', over18: true, title: '[Origin] Battlefield 4: Naval Strike (Free)', url: '' }])).resolves.toEqual([])
  })
  it('previously announced deals should be ignored', async () => {
    gdApiMock.isNewDeal.mockResolvedValue(false)
    await expect(notifier.getDealsToAnnounce([{ author: '', id: '', over18: false, title: '[Origin] Battlefield 4: Naval Strike (Free)', url: '' }])).resolves.toEqual([])
  })
  it('previously announced deals should be included', async () => {
    gdApiMock.isNewDeal.mockResolvedValue(true)
    await expect(notifier.getDealsToAnnounce([{
      author: '',
      id: '',
      over18: false,
      title: '[Origin] Battlefield 4: Naval Strike (Free)',
      url: ''
    }])).resolves.toEqual([{ author: '', id: '', over18: false, title: '[Origin] Battlefield 4: Naval Strike (Free)', url: '' }])
  })
})
