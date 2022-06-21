import pino from 'pino';
import DiscordClient from '../src/DiscordClient';
import GamesDealsAPIClient from '../src/GamesDealsAPIClient';
import Notifier from '../src/Notifier';
import { Deal, Webhook } from '../src/types/GamesDealsApi';

const logger = pino();

const indiegala: Deal = {
  author: '',
  id: '',
  title: '[IndieGala] Kill \'Em All ( 100% OFF / FREE )',
  url: '',
  over18: false,
};

const steam: Deal = {
  author: '',
  id: '',
  title: '[Steam] Don\'t Make Love ($0/100%)',
  url: '',
  over18: false,
};

const epic: Deal = {
  author: '',
  id: '',
  title: '[Epic Games] Costume Quest 2 + Layers of Fear 2 (Free / 100% off) from Oct 22 to Oct 29',
  url: '',
  over18: false,
};

const itchio: Deal = {
  author: '',
  id: '',
  title: '[itch.io] Unbridled Dungeon ( 100% OFF / FREE )',
  url: '',
  over18: false,
};

const gog: Deal = {
  author: '',
  id: '',
  title: '[GOG] Europa Universalis II Giveaway (100% off, 0$)',
  url: '',
  over18: false,
};

const webhooks: Webhook[] = [
  {
    blacklist: [],
    keywords: [],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['indiegala'],
    keywords: [],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['INDIEGALA'],
    keywords: [],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: [],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['steam'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['steam', 'epic'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['indiegala', 'itch.io'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: [],
    keywords: ['steam'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: [],
    keywords: ['Steam'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: [],
    keywords: ['epic'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: [],
    keywords: ['steam', 'epic'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: [],
    keywords: ['steam', 'epic', 'gog'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: ['gog', 'epic'],
    keywords: ['steam'],
    guild: '',
    id: '',
    token: '',
  },
  {
    blacklist: [],
    keywords: ['STEAM'],
    guild: '',
    id: '',
    token: '',
  },
];

const notifier = new Notifier(logger, new GamesDealsAPIClient(''), new DiscordClient('http://localhost'))

test('Get webhooks for steam deal', () => {
  const result = notifier.getWebhooksToExecute(steam, webhooks);
  expect(result).toEqual([
    {
      blacklist: [],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['INDIEGALA'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: ['steam'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: ['steam', 'epic'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['steam'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['Steam'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic', 'gog'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['gog', 'epic'],
      keywords: ['steam'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['STEAM'],
      guild: '',
      id: '',
      token: '',
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
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['INDIEGALA'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: ['steam', 'epic'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['epic'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic'],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic', 'gog'],
      guild: '',
      id: '',
      token: '',
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
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['INDIEGALA'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
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
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['INDIEGALA'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: [],
      guild: '',
      id: '',
      token: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic', 'gog'],
      guild: '',
      id: '',
      token: '',
    },
  ]);
});
