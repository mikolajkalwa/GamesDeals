import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import StatisticsController from './statistics.controller';
import DealsService from '../deals/deals.service';
import WebhookService from '../webhooks/webhook.service';
import { DealSchema, Deal } from '../deals/schemas/deal.schema';
import { Webhook, WebhookSchema } from '../webhooks/schemas/webhook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }]),
    MongooseModule.forFeature([{ name: Webhook.name, schema: WebhookSchema }]),

  ],
  controllers: [StatisticsController],
  providers: [DealsService, WebhookService],
})

export default class StatisticsModule { }
