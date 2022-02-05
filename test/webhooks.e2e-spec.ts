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

describe('Webhooks', () => {
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
    it('get all webhooks', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks')
        .expect(200);

      expect(response.body.length).toEqual(18);
    });

    it('get webhooks for specific guild', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks/guild/1337')
        .expect(200);

      expect(response.body.length).toEqual(3);

      (response.body as Webhook[]).forEach((webhook) => {
        expect(webhook.guild).toBe('1337');
      });
    });

    it('get webhooks for specific, non existing guild', async () => {
      const response = await request(app.getHttpServer())
        .get('/webhooks/guild/999999')
        .expect(200);

      expect(response.body.length).toEqual(0);
      expect(response.body).toEqual([]);
    });

    it('get webhook by id', async () => {
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

    it('get non existing webhook by id', async () => {
      await request(app.getHttpServer())
        .get('/webhooks/999999')
        .expect(404);
    });
  });

  describe('DELETE', () => {
    it('delete webhook by id', async () => {
      await request(app.getHttpServer())
        .delete('/webhooks/13')
        .expect(204);
    });

    it('delete non existing webhook by id', async () => {
      await request(app.getHttpServer())
        .delete('/webhooks/999999')
        .expect(204);
    });
  });

  describe('POST', () => {
    it('create basic webhook', async () => {
      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send({
          id: '1000',
          token: 'super-secret',
          guild: '17',
          channel: '1',
        })
        .expect(201);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1000',
        token: 'super-secret',
        guild: '17',
        channel: '1',
        mention: null,
        keywords: [],
        blacklist: [],
      }));
    });

    it('create webhook with mention', async () => {
      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send({
          id: '1001',
          token: 'super-secret',
          guild: '17',
          channel: '1',
          mention: '@here',
        })
        .expect(201);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1001',
        token: 'super-secret',
        guild: '17',
        channel: '1',
        mention: '@here',
        keywords: [],
        blacklist: [],
      }));
    });

    it('create webhook with mention, keywords and blacklist', async () => {
      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send({
          id: '1002',
          token: 'super-secret',
          guild: '17',
          channel: '1',
          mention: '@here',
          keywords: ['steam', 'epic'],
          blacklist: ['indiegala', 'itch.io'],
        })
        .expect(201);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1002',
        token: 'super-secret',
        guild: '17',
        channel: '1',
        mention: '@here',
        keywords: ['steam', 'epic'],
        blacklist: ['indiegala', 'itch.io'],
      }));
    });

    it('create webhook with id alredy existing in the db', async () => {
      await request(app.getHttpServer())
        .post('/webhooks')
        .send({
          id: '1002',
          token: 'super-secret',
          guild: '17',
          channel: '1',
          mention: '@here',
          keywords: ['steam', 'epic'],
          blacklist: ['indiegala', 'itch.io'],
        })
        .expect(409);
    });

    it('create webhook with requiered fields as empty strings', async () => {
      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send({
          id: '',
          token: '',
          guild: '',
          channel: '',
        })
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'id should not be empty',
        'id must be a number string',
        'token should not be empty',
        'guild should not be empty',
        'guild must be a number string',
        'channel should not be empty',
        'channel must be a number string',
      ]));
    });

    it('create webhook with empty body', async () => {
      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send({})
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'id should not be empty',
        'id must be a number string',
        'token should not be empty',
        'token must be a string',
        'guild should not be empty',
        'guild must be a number string',
        'channel should not be empty',
        'channel must be a number string',
      ]));
    });

    it('create webhook with completly invalid keywords, blacklist and mention', async () => {
      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send({
          id: '1111',
          token: 'super-secret',
          guild: '12',
          channel: '1',
          mention: '',
          keywords: ['', 'abc', 'abc', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas metus est, vestibulum at magna non, semper consectetur sapien. Suspendisse id finibus sapien. Integer ut lorem ac diam pharetra maximus non vel felis. Donec scelerisque rutrum rutrum. Aliquam eget neque in nibh condimentum condimentum. Praesent maximus laoreet lectus, non ultricies arcu blandit a. Nam tristique placerat felis, vitae mollis dui elementum eget. Cras convallis odio sapien, at rhoncus ipsum bibendum sit amet. Nunc vel ultricies leo. Nulla facilisi. Curabitur sed ante a leo efficitur posuere sit amet sed erat. Vestibulum vehicula porttitor quam, vitae convallis arcu dictum eu. Aliquam erat volutpat.'],
          blacklist: ['', 'cba', 'cba', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a tortor in enim scelerisque laoreet. Aliquam eget ornare sapien. Nunc eu congue urna. Donec facilisis ipsum quis quam tempor, sit amet imperdiet urna pretium. Donec euismod purus sed metus pretium, at ultricies augue efficitur. Donec pretium vel velit eu ullamcorper. Morbi non varius ipsum. Nunc in nisl volutpat, bibendum tellus sit amet, tincidunt diam. Ut tincidunt commodo ligula quis convallis. Sed sed pharetra massa. Praesent posuere dui at metus congue, tempus varius lectus elementum. Mauris lacinia id tortor quis ullamcorper. Maecenas blandit et turpis non ullamcorper. Praesent sit amet turpis.'],
        })
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        "All keywords's elements must be unique",
        'each value in keywords must be longer than or equal to 3 and shorter than or equal to 300 characters',
        "All blacklist's elements must be unique",
        'each value in blacklist must be longer than or equal to 3 and shorter than or equal to 300 characters',
        'mention should not be empty',
      ]));
    });
  });

  describe('PATCH', () => {
    it('non existing should return 404', async () => {
      await request(app.getHttpServer())
        .patch('/webhooks/999999')
        .send({
          mention: '@here',
        })
        .expect(404);
    });

    it('with empty body should return 400', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('No fields were provided to patch');
    });

    it('using invalid values should return 400', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          mention: '',
          keywords: ['', 'abc', 'abc', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas metus est, vestibulum at magna non, semper consectetur sapien. Suspendisse id finibus sapien. Integer ut lorem ac diam pharetra maximus non vel felis. Donec scelerisque rutrum rutrum. Aliquam eget neque in nibh condimentum condimentum. Praesent maximus laoreet lectus, non ultricies arcu blandit a. Nam tristique placerat felis, vitae mollis dui elementum eget. Cras convallis odio sapien, at rhoncus ipsum bibendum sit amet. Nunc vel ultricies leo. Nulla facilisi. Curabitur sed ante a leo efficitur posuere sit amet sed erat. Vestibulum vehicula porttitor quam, vitae convallis arcu dictum eu. Aliquam erat volutpat.'],
          blacklist: ['', 'cba', 'cba', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a tortor in enim scelerisque laoreet. Aliquam eget ornare sapien. Nunc eu congue urna. Donec facilisis ipsum quis quam tempor, sit amet imperdiet urna pretium. Donec euismod purus sed metus pretium, at ultricies augue efficitur. Donec pretium vel velit eu ullamcorper. Morbi non varius ipsum. Nunc in nisl volutpat, bibendum tellus sit amet, tincidunt diam. Ut tincidunt commodo ligula quis convallis. Sed sed pharetra massa. Praesent posuere dui at metus congue, tempus varius lectus elementum. Mauris lacinia id tortor quis ullamcorper. Maecenas blandit et turpis non ullamcorper. Praesent sit amet turpis.'],
        })
        .expect(400);

      expect(response.body.message).toEqual(expect.arrayContaining([
        'mention should not be empty',
        "All keywords's elements must be unique",
        'each value in keywords must be longer than or equal to 3 and shorter than or equal to 300 characters',
        "All blacklist's elements must be unique",
        'each value in blacklist must be longer than or equal to 3 and shorter than or equal to 300 characters',
      ]));
    });

    it('with empty body should return 400', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('No fields were provided to patch');
    });

    it('add mention, keywords and blacklist should return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          mention: '@here',
          keywords: ['steam', 'epic games'],
          blacklist: ['indiegala', 'itch.io'],
        })
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1',
        mention: '@here',
        keywords: ['steam', 'epic games'],
        blacklist: ['indiegala', 'itch.io'],
      }));
    });

    it('changing one property should not modify others', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          mention: '@everyone',
        })
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1',
        mention: '@everyone',
        keywords: ['steam', 'epic games'],
        blacklist: ['indiegala', 'itch.io'],
      }));
    });

    it('update mention role should return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          mention: '@coolPeople',
        })
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1',
        mention: '@coolPeople',
        keywords: ['steam', 'epic games'],
        blacklist: ['indiegala', 'itch.io'],
      }));
    });

    it('remove mention role should return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          mention: null,
        })
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1',
        mention: null,
        keywords: ['steam', 'epic games'],
        blacklist: ['indiegala', 'itch.io'],
      }));
    });

    it('update mention role and blacklist clear should return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          mention: '@people',
          blacklist: [],
        })
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1',
        mention: '@people',
        keywords: ['steam', 'epic games'],
        blacklist: [],
      }));
    });

    it('keywords clear should return 200', async () => {
      const response = await request(app.getHttpServer())
        .patch('/webhooks/1')
        .send({
          keywords: [],
        })
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: '1',
        keywords: [],
      }));
    });
  });
});
