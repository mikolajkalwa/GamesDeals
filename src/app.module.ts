import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import * as Joi from 'joi';
import HealthController from './health/health.controller';
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
        BASE_ADDRESS: Joi.string().ip().default('0.0.0.0'),
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().uri().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useCreateIndex: true,
    }),
    TerminusModule,
    DealsModule,
    WebhookModule,
    StatisticsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export default class AppModule { }
