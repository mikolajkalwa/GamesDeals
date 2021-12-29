import {
  Body, Controller, Post, Get, Delete, Patch, Param, HttpCode,
} from '@nestjs/common';
import { Webhook } from '@prisma/client';
import CreateWebhookDto from './dto/create-webhook.dto';
import PatchWebhookDto from './dto/patch-webhook.dto';
import WebhookService from './webhook.service';

@Controller('webhooks')
export default class WebhooksController {
  constructor(private readonly webhooksService: WebhookService) { }

  @Post()
  async create(@Body() webhook: CreateWebhookDto): Promise<Webhook> {
    return this.webhooksService.create(webhook);
  }

  @Get()
  async find(): Promise<Webhook[]> {
    return this.webhooksService.findMany();
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

  @HttpCode(204)
  @Delete(':webhook_id')
  async delete(@Param('webhook_id') webhookId: string): Promise<null> {
    return this.webhooksService.delete(webhookId);
  }
}
