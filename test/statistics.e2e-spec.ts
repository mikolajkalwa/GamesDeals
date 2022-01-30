import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import StatisticsModule from '../src/statistics/statistics.module';
import StatisticsService from '../src/statistics/statistics.service';

describe('Statistics', () => {
  let app: INestApplication;
  const statisticsService = { getStatistics: () => ({ dealsCount: 100, webhooksCount: 3000 }) };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [StatisticsModule],
    })
      .overrideProvider(StatisticsService)
      .useValue(statisticsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET statistics', async () => {
    const response = await request(app.getHttpServer())
      .get('/statistics')
      .expect(200);
    expect(response.body).toEqual(statisticsService.getStatistics());
  });

  afterAll(async () => {
    await app.close();
  });
});
