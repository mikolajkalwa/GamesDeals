import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Webhook } from '@prisma/client';
import PrismaService from 'src/prisma/prisma.service';
import CreateWebhookDto from './dto/create-webhook.dto';
import PatchWebhookDto from './dto/patch-webhook.dto';

@Injectable()
export default class WebhookService {
  constructor(private readonly prisma: PrismaService) { }

  async create(webhook: CreateWebhookDto): Promise<Webhook> {
    return this.prisma.webhook.create({
      data: {
        channel: BigInt(webhook.channelId),
        guild: BigInt(webhook.guildId),
        id: BigInt(webhook.webhookId),
        token: webhook.webhookToken,
        role: webhook.roleToMention ? BigInt(webhook.webhookId) : null,
        blacklist: webhook.blacklist,
        keywords: webhook.keywords,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.webhook.count();
  }

  async findMany(): Promise<Webhook[]> {
    return this.prisma.webhook.findMany();
  }

  async findByWebhookId(webhookId: string): Promise<Webhook> {
    const webhook = await this.prisma.webhook.findUnique({
      where: {
        id: BigInt(webhookId),
      },
    });
    if (!webhook) {
      throw new NotFoundException('No webhook found.');
    }
    return webhook;
  }

  // an array is returned because in the future there might be many webhooks per guild
  async findByGuild(guildId: string): Promise<Webhook[]> {
    return this.prisma.webhook.findMany({
      where: {
        guild: BigInt(guildId),
      },
    });
  }

  async delete(webhookId: string): Promise<null> {
    const deletedWebhook = await this.prisma.webhook.delete({
      where: {
        id: BigInt(webhookId),
      },
    });
    if (!deletedWebhook) {
      throw new NotFoundException('No webhook found.');
    }
    return null;
  }

  async patch(webhookId: string, webhookPatchData: PatchWebhookDto): Promise<Webhook> {
    if (
      webhookPatchData.keywords === undefined
      && webhookPatchData.blacklist === undefined
      && webhookPatchData.roleToMention === undefined) {
      throw new BadRequestException('No fields were provided to patch');
    }

    return this.prisma.webhook.update({
      where: {
        id: BigInt(webhookId),
      },
      data: {
        keywords: webhookPatchData.keywords ? webhookPatchData.keywords : [],
        blacklist: webhookPatchData.blacklist ? webhookPatchData.blacklist : [],
        role: webhookPatchData.roleToMention ? BigInt(webhookPatchData.roleToMention) : null,
      },
    });
  }
}
