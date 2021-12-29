import {
  Body, Controller, Get, Post, Query, Param,
} from '@nestjs/common';
import { Deal } from '@prisma/client';
import CreateDealDto from './dto/create-deal.dto';
import DealsService from './deals.service';

@Controller('deals')
export default class DealsController {
  constructor(private readonly dealsService: DealsService) { }

  @Post()
  async create(@Body() deal: CreateDealDto): Promise<Deal> {
    return this.dealsService.create(deal);
  }

  @Get('reddit/:reddit_id')
  async find(@Param('reddit_id') redditId: string): Promise<Deal> {
    return this.dealsService.find(redditId);
  }

  @Get('latest')
  async findLatest(@Query('limit') limit?: string): Promise<Deal[] | Deal> {
    if (!limit) {
      return this.dealsService.findLatest();
    }
    return this.dealsService.findLatests(+limit);
  }
}
