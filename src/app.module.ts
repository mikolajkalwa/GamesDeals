import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import * as Joi from 'joi';
import DealsModule from './deals/deals.module';
import WebhookModule from './webhooks/webhook.module';
import StatisticsModule from './statistics/statistics.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3000),
        MONGO_URL: Joi.string().uri().required(),
      }),
    }),
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
