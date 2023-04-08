import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query,
} from '@nestjs/common';
import type { Webhook } from '@prisma/client';
import CreateWebhookDto from './dto/create-webhook.dto';
import PatchWebhookDto from './dto/patch-webhook.dto';
import WebhookService from './webhook.service';

@Controller('webhooks')
export default class WebhooksController {
  constructor(private readonly webhooksService: WebhookService) { }

  @Post()
  async create(@Body() webhook: CreateWebhookDto): Promise<Webhook> {
    return await this.webhooksService.create(webhook);
  }

  @Get()
  async find(@Query('thread_title') threadTitle: string | undefined): Promise<Webhook[]> {
    return await this.webhooksService.findMany(threadTitle);
  }

  @Get('guild/:guild_id')
  async findByGuild(@Param('guild_id') guildId: string): Promise<Webhook[]> {
    return await this.webhooksService.findByGuild(guildId);
  }

  @Get(':webhook_id')
  async findByWebhookId(@Param('webhook_id') webhookId: string): Promise<Webhook> {
    return await this.webhooksService.findByWebhookId(webhookId);
  }

  @Patch(':webhook_id')
  async patch(@Param('webhook_id') webhookId: string, @Body() webhook: PatchWebhookDto): Promise<Webhook> {
    return await this.webhooksService.patch(webhookId, webhook);
  }

  @HttpCode(204)
  @Delete(':webhook_id')
  async delete(@Param('webhook_id') webhookId: string): Promise<null> {
    return await this.webhooksService.delete(webhookId);
  }
}
