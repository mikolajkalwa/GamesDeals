import { Controller, Get } from '@nestjs/common';
import DealsService from '../deals/deals.service';
import WebhookService from '../webhooks/webhook.service';

@Controller('statistics')
export default class StatisticsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly webhooksService: WebhookService,
  ) { }

  @Get()
  async getStatistics(): Promise<{ [k: string]: number }> {
    const dealsCount = await this.dealsService.count();
    const webhooksCount = await this.webhooksService.count();
    return { dealsCount, webhooksCount };
  }
}
