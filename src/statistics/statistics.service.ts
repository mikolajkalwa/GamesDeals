import { Injectable } from '@nestjs/common';
import PrismaService from '../prisma/prisma.service';

@Injectable()
export default class StatisticsService {
  constructor(private readonly prisma: PrismaService) { }

  async getStatistics(): Promise<{ [k: string]: number }> {
    const dealsCount = await this.prisma.deal.count();
    const webhooksCount = await this.prisma.webhook.count();
    return { dealsCount, webhooksCount };
  }
}
