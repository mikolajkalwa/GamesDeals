/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
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
    it('latest deal should return latest deal and status code 200', async () => {
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

    it('3 latest deals should return 3 element array with latest deals', async () => {
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

    it('latest deal with non numeric query should return error message', async () => {
      const response = await request(app.getHttpServer())
        .get('/deals/latest?limit=thisinnotanumber')
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      });
    });

    it('deal with reddit id should return a deal object', async () => {
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

    it('non existing deal with reddit id should return 404', async () => {
      await request(app.getHttpServer())
        .get('/deals/reddit/thisdoesntexist')
        .expect(404);
    });
  });

  describe('POST', () => {
    it('create new deal should save return status code 201 and newly created deal', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          redditId: '9rc66q',
          redditTitle: '[Steam] Metro 2033 (Free/100% off)',
          gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(201);

      expect(response.body).toEqual(expect.objectContaining({
        redditId: '9rc66q',
        redditTitle: '[Steam] Metro 2033 (Free/100% off)',
        gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
      }));
    });

    it('create new deal with empty reddit id should return status code 400 and error message', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          redditId: '',
          redditTitle: '[Steam] Metro 2033 (Free/100% off)',
          gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'redditId should not be empty',
      ]));
    });

    it('create new deal without reddit id should return status code 400 and error message', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          redditTitle: '[Steam] Metro 2033 (Free/100% off)',
          gameUrl: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'redditId should not be empty',
        'redditId must be a string',
      ]));
    });

    it('create new deal with invalid body should return status code 400 and error message', async () => {
      const response = await request(app.getHttpServer())
        .post('/deals')
        .send({
          some: '9rc66q',
          random: '[Steam] Metro 2033 (Free/100% off)',
          keys: 'https://store.steampowered.com/app/43110/Metro_2033/',
        })
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'redditId should not be empty',
        'redditId must be a string',
        'redditTitle should not be empty',
        'redditTitle must be a string',
        'gameUrl must be a URL address',
      ]));
    });
  });
});
