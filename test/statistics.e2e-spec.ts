import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import AppModule from '../src/app.module';

describe('Statistics', () => {
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
    it('statistics should return status code 200 and statistics data', async () => {
      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);

      expect(response.body).toHaveProperty('dealsCount');
      expect(response.body).toHaveProperty('webhooksCount');
    });
  });
});
