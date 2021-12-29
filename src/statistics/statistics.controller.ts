import { Controller, Get } from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';

@Controller('statistics')
export default class StatisticsController {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  @Get()
  async getStatistics(): Promise<{ [k: string]: number }> {
    const dealsCount = await this.prisma.deal.count();
    const webhooksCount = await this.prisma.webhook.count();
    return { dealsCount, webhooksCount };
  }
}
