import {
  Body, ConflictException, Controller, DefaultValuePipe, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Post, Query,
} from '@nestjs/common';
import type { Deal } from '@prisma/client';
import WebhookService from '../webhooks/webhook.service';
import DealsService from './deals.service';
import AnnounceDealDto from './dto/announce-deal.dto';
import CreateDealDto from './dto/create-deal.dto';

@Controller('deals')
export default class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly webhooksService: WebhookService,
  ) { }

  @Post()
  async create(@Body() deal: CreateDealDto): Promise<Deal> {
    return await this.dealsService.create(deal);
  }

  @HttpCode(202)
  @Post('announce')
  async announce(@Body() deal: AnnounceDealDto) {
    const existingDeal = await this.dealsService.find(deal.redditId);
    if (existingDeal) {
      throw new ConflictException('Deal was already announced.');
    }

    const webhooksToExecute = await this.webhooksService.findMany(deal.redditTitle);
    await this.dealsService.create(deal);
    await this.dealsService.announce(deal, webhooksToExecute);
  }

  @Get('reddit/:reddit_id')
  async find(@Param('reddit_id') redditId: string): Promise<Deal> {
    const deal = await this.dealsService.find(redditId);
    if (!deal) {
      throw new NotFoundException('No deal found.');
    }
    return deal;
  }

  @Get('latest')
  async findLatest(@Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit = 1): Promise<Deal[]> {
    return await this.dealsService.findLatest(limit);
  }
}
