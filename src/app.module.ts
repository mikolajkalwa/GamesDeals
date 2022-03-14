import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import * as Joi from 'joi';
import DealsModule from './deals/deals.module';
import WebhookModule from './webhooks/webhook.module';
import StatisticsModule from './statistics/statistics.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        enabled: !Object.is(process.env.NODE_ENV, 'test'),
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        BASE_ADDRESS: Joi.string().ip().default('0.0.0.0'),
        PORT: Joi.number().default(3000),
      }),
    }),
    PrometheusModule.register(),
    DealsModule,
    WebhookModule,
    StatisticsModule,
  ],
  providers: [],
})
export default class AppModule { }
