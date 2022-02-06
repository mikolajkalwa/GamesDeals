import {
  Body, Controller, Get, Post, Query, Param, ParseIntPipe, DefaultValuePipe,
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
  async findLatest(@Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1): Promise<Deal[]> {
    return this.dealsService.findLatest(limit);
  }
}
