import { Injectable, NotFoundException } from '@nestjs/common';
import { Deal } from '@prisma/client';
import PrismaService from '../prisma/prisma.service';
import CreateDealDto from './dto/create-deal.dto';

@Injectable()
export default class DealsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(creatDealDto: CreateDealDto): Promise<Deal> {
    return this.prisma.deal.create({
      data: {
        gameUrl: creatDealDto.gameUrl,
        redditId: creatDealDto.redditId,
        redditTitle: creatDealDto.redditTitle,
      },
    });
  }

  async find(redditId: string): Promise<Deal> {
    const deal = await this.prisma.deal.findFirst({
      where: {
        redditId,
      },
    });
    if (!deal) {
      throw new NotFoundException('No deal found.');
    }
    return deal;
  }

  async findLatest(limit = 1): Promise<Deal[]> {
    return this.prisma.deal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async count(): Promise<number> {
    return this.prisma.deal.count();
  }
}
