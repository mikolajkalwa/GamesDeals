import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import DealsModule from './deals/deals.module';
import HealthModule from './health/health.module';
import StatisticsModule from './statistics/statistics.module';
import WebhookModule from './webhooks/webhook.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        enabled: !Object.is(process.env['NODE_ENV'], 'test'),
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        BASE_ADDRESS: Joi.string().ip().default('0.0.0.0'),
        PORT: Joi.number().default(3000),
        REDIS_HOST: Joi.string().default('0.0.0.0'),
        REDIS_PORT: Joi.number().default(6379),
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env['REDIS_HOST'] || '0.0.0.0',
        port: Number(process.env['REDIS_PORT']) || 6379,
      },
    }),
    DealsModule,
    WebhookModule,
    StatisticsModule,
    HealthModule,
  ],
  providers: [],
})
export default class AppModule { }
