import { Deal } from '../src/types/Deal';
import { Webhook } from '../src/types/Webhook';
import { Notifier } from '../src/Notifier';
import pino from 'pino';
import { GamesDealsAPIClient } from '../src/GamesDealsAPIClient';
import { DiscordClient } from '../src/DiscordClient';

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
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: ['indiegala'],
    keywords: [],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: [],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['steam'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['steam', 'epic'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['indiegala', 'itch.io'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: [],
    keywords: ['steam'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: [],
    keywords: ['Steam'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: [],
    keywords: ['epic'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: [],
    keywords: ['steam', 'epic'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: [],
    keywords: ['steam', 'epic', 'gog'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
  {
    blacklist: ['gog', 'epic'],
    keywords: ['steam'],
    guildId: '',
    webhookId: '',
    webhookToken: '',
  },
];

const notifier = new Notifier(logger, new GamesDealsAPIClient(''), new DiscordClient(''))

test('Get webhooks for steam deal', () => {
  const result = notifier.getWebhooksToExecute(steam, webhooks);
  expect(result).toEqual([
    {
      blacklist: [],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: ['steam'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: ['steam', 'epic'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['steam'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['Steam'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic', 'gog'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['gog', 'epic'],
      keywords: ['steam'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
  ]);
});

test('Get webhooks for indiegala deal', () => {
  const result = notifier.getWebhooksToExecute(indiegala, webhooks);
  expect(result).toEqual([
    {
      blacklist: [],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
  ]);
});

test('Get webhooks for epic deal', () => {
  const result = notifier.getWebhooksToExecute(epic, webhooks);
  expect(result).toEqual([
    {
      blacklist: [],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: ['steam', 'epic'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['epic'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic', 'gog'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
  ]);
});

test('Get webhooks for itchio deal', () => {
  const result = notifier.getWebhooksToExecute(itchio, webhooks);
  expect(result).toEqual([
    {
      blacklist: [],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
  ]);
});

test('Get webhooks for gog deal', () => {
  const result = notifier.getWebhooksToExecute(gog, webhooks);
  expect(result).toEqual([
    {
      blacklist: [],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: ['indiegala', 'itch.io'],
      keywords: [],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
    {
      blacklist: [],
      keywords: ['steam', 'epic', 'gog'],
      guildId: '',
      webhookId: '',
      webhookToken: '',
    },
  ]);
});
