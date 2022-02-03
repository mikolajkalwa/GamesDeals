/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import AppModule from '../src/app.module';

describe('Deals', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET', () => {
    it('/GET latest deal', async () => {
      const response = await request(app.getHttpServer())
        .get('/deals/latest')
        .expect(200);

      expect(response.body).toEqual([
        {
          id: 4,
          createdAt: '2021-12-30T16:15:08.177Z',
          updatedAt: '2021-12-30T16:15:08.177Z',
          redditId: 'rs51th',
          redditTitle: '[Epic Games] Tomb Raider: Definitive Survivor Trilogy (Free/100% off)',
          gameUrl: 'https://www.epicgames.com/store/en-US/free-games',
        },
      ]);
    });

    it('/GET 3 latest deals', async () => {
      const response = await request(app.getHttpServer())
        .get('/deals/latest?limit=3')
        .expect(200);
      expect(response.body).toEqual([
        {
          id: 4,
          createdAt: '2021-12-30T16:15:08.177Z',
          updatedAt: '2021-12-30T16:15:08.177Z',
          redditId: 'rs51th',
          redditTitle: '[Epic Games] Tomb Raider: Definitive Survivor Trilogy (Free/100% off)',
          gameUrl: 'https://www.epicgames.com/store/en-US/free-games',
        },
        {
          id: 3,
          createdAt: '2018-05-17T17:45:13.000Z',
          updatedAt: '2018-05-17T17:45:13.000Z',
          redditId: '8k5uct',
          redditTitle: '[Humble Store] Galactic Civilizations II: Ultimate Edition (Free)',
          gameUrl: 'https://www.humblebundle.com/store/galactic-civilizations-ii-ultimate-edition',
        },
        {
          id: 2,
          createdAt: '2018-05-13T00:30:01.000Z',
          updatedAt: '2018-05-13T00:30:01.000Z',
          redditId: '8iyde5',
          redditTitle: '[Indiegala] Dead Bits Free/100% off.',
          gameUrl: 'https://www.indiegala.com/giveaways',
        },
      ]);
    });

    it('/GET latest deal with invalid query param', async () => {
      const response = await request(app.getHttpServer())
        .get('/deals/latest?limit=thisinnotanumber')
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
    });

    it('/GET deal with reddit id', async () => {
      const response = await request(app.getHttpServer())
        .get('/deals/reddit/8iyde5')
        .expect(200);

      expect(response.body).toEqual({
        id: 2,
        createdAt: '2018-05-13T00:30:01.000Z',
        updatedAt: '2018-05-13T00:30:01.000Z',
        redditId: '8iyde5',
        redditTitle: '[Indiegala] Dead Bits Free/100% off.',
        gameUrl: 'https://www.indiegala.com/giveaways',
      });
    });

    it('/GET non existing deal with reddit id should return 404', async () => {
      await request(app.getHttpServer())
        .get('/deals/reddit/thisdoesntexist')
        .expect(404);
    });
  });

  describe('POST', () => {
    it('/POST create new deal', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          redditId: '9rc66q',
          redditTitle: '[Steam] Metro 2033 (Free/100% off)',
          gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(201);
      expect(response.body.redditId).toBe('9rc66q');
      expect(response.body.redditTitle).toBe('[Steam] Metro 2033 (Free/100% off)');
      expect(response.body.gameUrl).toBe('https://store.steampowered.com/app/43110/Metro_2033/');
    });

    it('/POST create new deal with empty reddit id', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          redditId: '',
          redditTitle: '[Steam] Metro 2033 (Free/100% off)',
          gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(400);

      expect(response.body.message).toHaveLength(1);
    });

    it('/POST create new deal with missing reddit id', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          redditTitle: '[Steam] Metro 2033 (Free/100% off)',
          gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(400);

      expect(response.body.message).toHaveLength(2);
    });

    it('/POST create new deal with invalid body', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          some: '9rc66q',
          random: '[Steam] Metro 2033 (Free/100% off)',
          keys: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(400);

      expect(response.body.message).toHaveLength(5);
    });
  });
});
