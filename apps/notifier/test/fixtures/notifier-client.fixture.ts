import type { Deal, Webhook } from '../../src/types/games-deal-api.type';

export const indiegala: Deal = {
  author: '',
  id: '',
  title: '[IndieGala] Kill \'Em All ( 100% OFF / FREE )',
  url: '',
  over18: false,
};

export const steam: Deal = {
  author: '',
  id: '',
  title: '[Steam] Don\'t Make Love ($0/100%)',
  url: '',
  over18: false,
};

export const epic: Deal = {
  author: '',
  id: '',
  title: '[Epic Games] Costume Quest 2 + Layers of Fear 2 (Free / 100% off) from Oct 22 to Oct 29',
  url: '',
  over18: false,
};

export const itchio: Deal = {
  author: '',
  id: '',
  title: '[itch.io] Unbridled Dungeon ( 100% OFF / FREE )',
  url: '',
  over18: false,
};

export const gog: Deal = {
  author: '',
  id: '',
  title: '[GOG] Europa Universalis II Giveaway (100% off, 0$)',
  url: '',
  over18: false,
};

export const webhooks: Webhook[] = [
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
    blacklist: ['indiegala', 'itch.io'],
    keywords: ['indiegala', 'itch.io'],
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
];
