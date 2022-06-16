import { Test } from '@nestjs/testing';
import PrismaModule from '../prisma/prisma.module';
import PrismaService from '../prisma/prisma.service';
import DealsController from './deals.controller';
import DealsService from './deals.service';

describe('DealsController', () => {
  let dealsController: DealsController;
  let dealsService: DealsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [DealsController],
      providers: [DealsService],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .compile();

    dealsService = moduleRef.get<DealsService>(DealsService);
    dealsController = moduleRef.get<DealsController>(DealsController);
  });

  it('should be defined', () => {
    expect(dealsController).toBeDefined();
  });

  describe('get deals', () => {
    it('should return latest deal', async () => {
      const result = [{
        id: 1,
        createdAt: new Date(Date.parse('01/27/2022')),
        updatedAt: new Date(Date.parse('01/27/2022')),
        redditId: 'se1n5w',
        redditTitle: '[Epic Games] DAEMON X MACHINA (Free / 100% off)',
        gameUrl: 'https://www.epicgames.com/store/en-US/p/daemon-x-machina',
      }];
      const spy = jest.spyOn(dealsService, 'findLatest').mockImplementation(() => Promise.resolve(result));

      expect(await dealsController.findLatest()).toEqual(result);
      expect(spy).toBeCalledTimes(1);
    });

    it('should return deal by reddit id', async () => {
      const result = {
        id: 1,
        createdAt: new Date(Date.parse('01/27/2022')),
        updatedAt: new Date(Date.parse('01/27/2022')),
        redditId: 'se1n5w',
        redditTitle: '[Epic Games] DAEMON X MACHINA (Free / 100% off)',
        gameUrl: 'https://www.epicgames.com/store/en-US/p/daemon-x-machina',
      };
      const spy = jest.spyOn(dealsService, 'find').mockImplementation(() => Promise.resolve(result));

      expect(await dealsController.find('se1n5w')).toEqual(result);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('create deal', () => {
    it('should return created deal', async () => {
      const result = {
        id: 1,
        createdAt: new Date(Date.parse('01/27/2022')),
        updatedAt: new Date(Date.parse('01/27/2022')),
        redditId: 'se1n5w',
        redditTitle: '[Epic Games] DAEMON X MACHINA (Free / 100% off)',
        gameUrl: 'https://www.epicgames.com/store/en-US/p/daemon-x-machina',
      };
      const spy = jest.spyOn(dealsService, 'create').mockImplementation(() => Promise.resolve(result));

      expect(await dealsController.create({ gameUrl: result.gameUrl, redditId: result.redditId, redditTitle: result.redditTitle })).toEqual(result);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
