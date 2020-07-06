import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import WebhookController from './webhook.controller';
import WebhookService from './webhook.service';
import { Webhook, WebhookSchema } from './schemas/webhook.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Webhook.name, schema: WebhookSchema }])],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export default class DealsModule { }
