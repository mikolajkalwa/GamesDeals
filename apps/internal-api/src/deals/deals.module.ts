import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import PrismaModule from '../prisma/prisma.module';
import WebhookModule from '../webhooks/webhook.module';
import DealsController from './deals.controller';
import DealsService from './deals.service';

@Module({
  imports: [
    PrismaModule,
    WebhookModule,
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions: {
        attempts: 6,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
        removeOnComplete: true,
        removeOnFail: {
          count: 5000,
        },
      },
    }),
  ],
  controllers: [DealsController],
  providers: [DealsService],
})
export default class DealsModule {}
