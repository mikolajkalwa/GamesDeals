/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Webhook } from '@prisma/client';
import AppModule from '../src/app.module';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return this.toString();
};

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
    it('/GET all webhooks', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks')
        .expect(200);

      expect(response.body.length).toEqual(18);
    });

    it('/GET webhooks for specific guild', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks/guild/1337')
        .expect(200);

      expect(response.body.length).toEqual(3);

      (response.body as Webhook[]).forEach((webhook) => {
        expect(webhook.guild).toBe('1337');
      });
    });

    it('/GET webhooks for specific, non existing guild', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks/guild/999999')
        .expect(200);

      expect(response.body.length).toEqual(0);
      expect(response.body).toEqual([]);
    });

    it('/GET webhook by id', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks/13')
        .expect(200);

      expect(response.body).toEqual({
        blacklist: [],
        keywords: ['steam', 'epic', 'gog'],
        guild: '13',
        channel: '13',
        id: '13',
        mention: null,
        token: '',
        createdAt: '2018-05-14T18:20:33.000Z',
        updatedAt: '2018-05-14T18:20:33.000Z',
      });
    });

    it('/GET non existing webhook by id', async () => {
      await request(app.getHttpServer())
        .get('/webhooks/999999')
        .expect(404);
    });
  });

  describe('DELETE', () => {
    it('/DELETE webhook by id', async () => {
      await request(app.getHttpServer())
        .delete('/webhooks/13')
        .expect(204);
    });

    it('/DELETE non existing webhook by id', async () => {
      await request(app.getHttpServer())
        .delete('/webhooks/999999')
        .expect(204);
    });
  });
});
