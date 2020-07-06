import {
  Body, Controller, Post, Query, Get, Delete, Patch, Param,
} from '@nestjs/common';
import CreateWebhookDto from './dto/create-webhook.dto';
import PatchWebhookDto from './dto/patch-webhook.dto';
import { Webhook } from './schemas/webhook.schema';
import WebhookService from './webhook.service';

@Controller('webhooks')
export default class WebhooksController {
  constructor(private readonly webhooksService: WebhookService) { }

  @Post()
  async create(@Body() webhook: CreateWebhookDto): Promise<Webhook> {
    return this.webhooksService.create(webhook);
  }

  @Get()
  async find(@Query('limit') limit: string, @Query('last_id') lastId: string): Promise<Webhook[]> {
    if (limit) {
      return this.webhooksService.findMany(+limit, lastId);
    }
    return this.webhooksService.findMany(undefined, lastId);
  }

  @Get('guild/:guild_id')
  async findByGuild(@Param('guild_id') guildId: string): Promise<Webhook[]> {
    return this.webhooksService.findByGuild(guildId);
  }

  @Get(':webhook_id')
  async findByWebhookId(@Param('webhook_id') webhookId: string): Promise<Webhook> {
    return this.webhooksService.findByWebhookId(webhookId);
  }

  @Patch(':webhook_id')
  async patch(@Param('webhook_id') webhookId: string, @Body() webhook: PatchWebhookDto): Promise<Webhook> {
    return this.webhooksService.patch(webhookId, webhook);
  }

  @Delete(':webhook_id')
  async delete(@Param('webhook_id') webhookId: string): Promise<null> {
    return this.webhooksService.delete(webhookId);
  }
}
