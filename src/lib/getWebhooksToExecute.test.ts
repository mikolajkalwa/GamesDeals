import { Deal } from '../models/Deal';
import { Webhook } from '../models/Webhook';
import getWebhooksToExecute from './getWebhooksToExecute';

const indiegala: Deal = {
  author: '',
  id: '',
  title: '[IndieGala] Kill \'Em All ( 100% OFF / FREE )',
  url: '',
};

const steam: Deal = {
  author: '',
  id: '',
  title: '[Steam] Don\'t Make Love ($0/100%)',
  url: '',
};

const epic: Deal = {
  author: '',
  id: '',
  title: '[Epic Games] Costume Quest 2 + Layers of Fear 2 (Free / 100% off) from Oct 22 to Oct 29',
  url: '',
};

const itchio: Deal = {
  author: '',
  id: '',
  title: '[itch.io] Unbridled Dungeon ( 100% OFF / FREE )',
  url: '',
};

const gog: Deal = {
  author: '',
  id: '',
  title: '[GOG] Europa Universalis II Giveaway (100% off, 0$)',
  url: '',
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

test('Get webhooks for steam deal', () => {
  const result = getWebhooksToExecute(steam, webhooks);
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
  const result = getWebhooksToExecute(indiegala, webhooks);
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
  const result = getWebhooksToExecute(epic, webhooks);
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
  const result = getWebhooksToExecute(itchio, webhooks);
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
  const result = getWebhooksToExecute(gog, webhooks);
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
