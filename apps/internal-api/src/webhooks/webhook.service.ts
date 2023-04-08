import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { Prisma, Webhook } from '@prisma/client';
import PrismaService from '../prisma/prisma.service';
import type CreateWebhookDto from './dto/create-webhook.dto';
import type PatchWebhookDto from './dto/patch-webhook.dto';

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

    return await this.prisma.webhook.create({
      data: {
        channel: BigInt(webhook.channel),
        guild: BigInt(webhook.guild),
        id: BigInt(webhook.id),
        token: webhook.token,
        mention: webhook.mention ? BigInt(webhook.mention) : null,
        blacklist: webhook.blacklist ?? [],
        keywords: webhook.keywords ?? [],
        channelType: webhook.channelType,
      },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.webhook.count();
  }

  async findMany(threadTitle: string | undefined): Promise<Webhook[]> {
    if (!threadTitle) {
      return await this.prisma.webhook.findMany();
    }

    return await this.prisma.$queryRaw`
      SELECT *
      FROM webhooks
      WHERE (COALESCE(cardinality(blacklist), 0) = 0 AND COALESCE(cardinality(keywords), 0) = 0)
        OR (${threadTitle} ILIKE ANY (SELECT '%' || unnest(keywords) || '%')
          AND NOT ${threadTitle} ILIKE ANY (SELECT '%' || unnest(blacklist) || '%'))
        OR (COALESCE(cardinality(keywords), 0) = 0 AND NOT ${threadTitle} ILIKE ANY (SELECT '%' || unnest(blacklist) || '%'));`;
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
    return await this.prisma.webhook.findMany({
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
      patchObject.mention = webhookPatchData.mention ? BigInt(webhookPatchData.mention) : null;
    }

    if (Object.prototype.hasOwnProperty.call(webhookPatchData, 'blacklist') && webhookPatchData.blacklist) {
      patchObject.blacklist = webhookPatchData.blacklist;
    }

    if (Object.prototype.hasOwnProperty.call(webhookPatchData, 'keywords') && webhookPatchData.keywords) {
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
