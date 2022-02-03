import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.deal.createMany({
      data: [{
        gameUrl: 'https://store.steampowered.com/app/439190/Stories_The_Path_of_Destinies/',
        redditId: '8ir0hr',
        redditTitle: '[Steam] Stories: The Path of Destinies (Free/100% off to keep forever)',
        createdAt: '2018-05-12T18:30:01.000Z',
        updatedAt: '2018-05-12T18:30:01.000Z',
      },
      {
        gameUrl: 'https://www.indiegala.com/giveaways',
        redditId: '8iyde5',
        redditTitle: '[Indiegala] Dead Bits Free/100% off.',
        createdAt: '2018-05-13T00:30:01.000Z',
        updatedAt: '2018-05-13T00:30:01.000Z',
      },
      {
        gameUrl: 'https://www.humblebundle.com/store/galactic-civilizations-ii-ultimate-edition',
        redditId: '8k5uct',
        redditTitle: '[Humble Store] Galactic Civilizations II: Ultimate Edition (Free)',
        createdAt: '2018-05-17T17:45:13.000Z',
        updatedAt: '2018-05-17T17:45:13.000Z',
      }, {
        gameUrl: 'https://www.epicgames.com/store/en-US/free-games',
        redditId: 'rs51th',
        redditTitle: '[Epic Games] Tomb Raider: Definitive Survivor Trilogy (Free/100% off)',
        createdAt: '2021-12-30T16:15:08.177Z',
        updatedAt: '2021-12-30T16:15:08.177Z',
      }],
      skipDuplicates: true
    }),
    prisma.webhook.createMany({
      data: [{
        guild: 1,
        channel: 1,
        id: 1,
        token: '',
        createdAt: '2018-05-12T18:20:33.000Z',
        updatedAt: '2018-05-12T18:20:33.000Z',
      },
      {
        guild: 2,
        channel: 2,
        id: 2,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      }, {
        blacklist: ['indiegala'],
        keywords: [],
        guild: 3,
        channel: 3,
        id: 3,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      }, {
        blacklist: ['INDIEGALA'],
        keywords: [],
        guild: 4,
        channel: 4,
        id: 4,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: [],
        guild: 5,
        channel: 5,
        id: 5,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: ['steam'],
        guild: 6,
        channel: 6,
        id: 6,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: ['steam', 'epic'],
        guild: 7,
        channel: 7,
        id: 7,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: ['indiegala', 'itch.io'],
        keywords: ['indiegala', 'itch.io'],
        guild: 8,
        channel: 8,
        id: 8,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: [],
        keywords: ['steam'],
        guild: 9,
        channel: 9,
        id: 9,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: [],
        keywords: ['Steam'],
        guild: 10,
        channel: 10,
        id: 10,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: [],
        keywords: ['epic'],
        guild: 11,
        channel: 11,
        id: 11,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic'],
        guild: 12,
        channel: 12,
        id: 12,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: [],
        keywords: ['steam', 'epic', 'gog'],
        guild: 13,
        channel: 13,
        id: 13,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: ['gog', 'epic'],
        keywords: ['steam'],
        guild: 14,
        channel: 14,
        id: 14,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      },
      {
        blacklist: [],
        keywords: ['STEAM'],
        guild: 15,
        channel: 15,
        id: 15,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      }],
      skipDuplicates: true
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
