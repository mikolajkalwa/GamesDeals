import { Controller, Get } from '@nestjs/common';
import StatisticsService from './statistics.service';

@Controller('statistics')
export default class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics() {
    return await this.statisticsService.getStatistics();
  }
}
