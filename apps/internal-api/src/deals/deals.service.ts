import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Deal, Webhook } from '@prisma/client';
import { Queue } from 'bullmq';
import PrismaService from '../prisma/prisma.service';
import AnnounceDealDto from './dto/announce-deal.dto';
import type CreateDealDto from './dto/create-deal.dto';

@Injectable()
export default class DealsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) { }

  // eslint-disable-next-line class-methods-use-this
  #getMention(webhook: Webhook): string | null {
    if (Object.prototype.hasOwnProperty.call(webhook, 'mention') && webhook.mention) {
      if (webhook.mention === webhook.guild) {
        return '@everyone';
      }
      return `<@&${webhook.mention}>`;
    }
    return null;
  }

  async announce(deal: AnnounceDealDto, webhooksToExecute: Webhook[]) {
    const jobs = webhooksToExecute.map((webhook) => {
      const mention = this.#getMention(webhook);

      if (webhook.channelType === 'GUILD_FORUM') {
        const message = mention
          ? `<${deal.gameUrl}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.redditId}\n${mention}`
          : `<${deal.gameUrl}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.redditId}`;

        return {
          name: 'send-notification',
          data: {
            webhook: {
              id: webhook.id,
              token: webhook.token,
            },
            content: message,
            threadName: deal.redditTitle,
          },
        };
      }

      const message = mention
        ? `**${deal.redditTitle}**\n<${deal.gameUrl}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.redditId}\n${mention}`
        : `**${deal.redditTitle}**\n<${deal.gameUrl}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.redditId}\n`;

      return {
        name: 'send-notification',
        data: {
          id: webhook.id,
          token: webhook.token,
          content: message,
        },
      };
    });

    await this.notificationsQueue.addBulk(jobs);
  }

  async create(creatDealDto: CreateDealDto): Promise<Deal> {
    return await this.prisma.deal.create({
      data: {
        gameUrl: creatDealDto.gameUrl,
        redditId: creatDealDto.redditId,
        redditTitle: creatDealDto.redditTitle,
      },
    });
  }

  async find(redditId: string): Promise<Deal | null> {
    return await this.prisma.deal.findFirst({
      where: {
        redditId,
      },
    });
  }

  async findLatest(limit = 1): Promise<Deal[]> {
    return await this.prisma.deal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async count(): Promise<number> {
    return await this.prisma.deal.count();
  }
}
