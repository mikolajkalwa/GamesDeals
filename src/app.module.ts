import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DealsModule from './deals/deals.module';
import WebhookModule from './webhooks/webhook.module';
import StatisticsModule from './statistics/statistics.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      useCreateIndex: true,
    }),
    DealsModule,
    WebhookModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule { }
