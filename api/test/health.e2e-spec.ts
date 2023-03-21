import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import AppModule from '../src/app.module';

describe('Health', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET', () => {
    it('service should be healthy', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        status: 'ok',
      }));
    });
  });
});
