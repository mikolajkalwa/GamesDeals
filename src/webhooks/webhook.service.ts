import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { Webhook, Prisma } from '@prisma/client';
import PrismaService from '../prisma/prisma.service';
import CreateWebhookDto from './dto/create-webhook.dto';
import PatchWebhookDto from './dto/patch-webhook.dto';

@Injectable()
export default class WebhookService {
  constructor(private readonly prisma: PrismaService) { }

  async create(webhook: CreateWebhookDto): Promise<Webhook> {
    const existingWebhook = await this.prisma.webhook.findUnique({
      where: {
        id: BigInt(webhook.id),
      },
    });

    if (existingWebhook) {
      throw new ConflictException('webhook with provided id already exists');
    }

    return this.prisma.webhook.create({
      data: {
        channel: BigInt(webhook.channel),
        guild: BigInt(webhook.guild),
        id: BigInt(webhook.id),
        token: webhook.token,
        mention: webhook.mention ? webhook.mention : null,
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
    try {
      await this.prisma.webhook.delete({
        where: {
          id: BigInt(webhookId),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return null;
        }
      }
      throw error;
    }
    return null;
  }

  async patch(webhookId: string, webhookPatchData: PatchWebhookDto): Promise<Webhook> {
    if (
      webhookPatchData.keywords === undefined
      && webhookPatchData.blacklist === undefined
      && webhookPatchData.mention === undefined) {
      throw new BadRequestException('No fields were provided to patch');
    }

    const patchObject: Prisma.WebhookUpdateInput = {};

    if (Object.prototype.hasOwnProperty.call(webhookPatchData, 'mention')) {
      patchObject.mention = webhookPatchData.mention ? webhookPatchData.mention : null;
    }

    if (Object.prototype.hasOwnProperty.call(webhookPatchData, 'blacklist')) {
      patchObject.blacklist = webhookPatchData.blacklist;
    }

    if (Object.prototype.hasOwnProperty.call(webhookPatchData, 'keywords')) {
      patchObject.keywords = webhookPatchData.keywords;
    }

    try {
      return await this.prisma.webhook.update({
        where: {
          id: BigInt(webhookId),
        },
        data: patchObject,
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('webhook with provided id doesn\'t exist');
        }
      }
      throw error;
    }
  }
}
