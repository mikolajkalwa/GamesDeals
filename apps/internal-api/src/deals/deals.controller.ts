import {
  Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query,
} from '@nestjs/common';
import type { Deal } from '@prisma/client';
import DealsService from './deals.service';
import CreateDealDto from './dto/create-deal.dto';

@Controller('deals')
export default class DealsController {
  constructor(private readonly dealsService: DealsService) { }

  @Post()
  async create(@Body() deal: CreateDealDto): Promise<Deal> {
    return await this.dealsService.create(deal);
  }

  @Get('reddit/:reddit_id')
  async find(@Param('reddit_id') redditId: string): Promise<Deal> {
    return await this.dealsService.find(redditId);
  }

  @Get('latest')
  async findLatest(@Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1): Promise<Deal[]> {
    return await this.dealsService.findLatest(limit);
  }
}
