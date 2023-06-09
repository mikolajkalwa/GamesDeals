import { Test } from '@nestjs/testing';
import PrismaModule from '../prisma/prisma.module';
import PrismaService from '../prisma/prisma.service';
import StatisticsController from './statistics.controller';
import StatisticsService from './statistics.service';

describe('StatisticsController', () => {
  let statisticsController: StatisticsController;
  let statisticsService: StatisticsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [StatisticsController],
      providers: [StatisticsService],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .compile();

    statisticsService = moduleRef.get<StatisticsService>(StatisticsService);
    statisticsController =
      moduleRef.get<StatisticsController>(StatisticsController);
  });

  it('should be defined', () => {
    expect(statisticsController).toBeDefined();
  });

  describe('getStatistics', () => {
    it('should return deal count and webhook count', async () => {
      const result = { dealsCount: 100, webhooksCount: 3000 };
      const spy = jest
        .spyOn(statisticsService, 'getStatistics')
        .mockImplementation(() => Promise.resolve(result));

      expect(await statisticsController.getStatistics()).toEqual(result);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
