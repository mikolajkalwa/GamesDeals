import got from 'got/dist/source';
import { Logger } from 'pino';
import { inject, injectable } from 'tsyringe';
import { IDiscordClient } from './DiscordClient';
import { IGamesDealsAPIClient } from './GamesDealsAPIClient';
import isFree from './lib/isFree';
import { Deal } from './models/Deal';
import { Webhook } from './models/Webhook';

export interface INotifier {
  getDealsToAnnounce(deals: Deal[]): Promise<Deal[]>;
  getWebhooksToExecute(deal: Deal, allWebhooks: Webhook[]): Promise<Webhook[]>;
  announceDeal(deal: Deal, allWebhooks: Webhook[]): Promise<ExecutionResult>;
  reportExecutionResult(
    executionResult: ExecutionResult,
    webhook?: string,
  ): Promise<void>;
  cleanupInvalidWebhooks(webhooks: Webhook[]): Promise<void>;
}

export interface ExecutionResult {
  webhooksToExecute: Webhook[];
  webhooksToRemove: Webhook[];
  rateLimitedWebhooks: Webhook[];
  failedWebhooks: Webhook[];
  badRequestWebhooks: Webhook[];
}

@injectable()
export class Notifier implements INotifier {
  constructor(
    @inject('Logger') private readonly logger: Logger,
    @inject('IGamesDealsAPIClient') private readonly gdApiClient: IGamesDealsAPIClient,
    @inject('IDiscordClient') private readonly discordClient: IDiscordClient,
  ) { }

  public getDealsToAnnounce = async (deals: Deal[]) => (
    await Promise.all(deals.map(async (deal) => {
      if (deal.over18) {
        return null;
      }

      if (isFree(deal.title)) {
        const isNew = await this.gdApiClient.isNewDeal(deal.id);
        if (isNew) {
          return deal;
        }
      }

      return null;
    }))).filter(Boolean) as Deal[];

  public static createMessageContent = (deal: Deal) => `**${deal.title}**\n<${deal.url}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.id}\n`;

  public getWebhooksToExecute = async (deal: Deal, allWebhooks: Webhook[]) => {
    const title = deal.title.toLowerCase();

    const webhooksToExecute = allWebhooks.filter((webhook) => {
      if (webhook.keywords.length === 0 && webhook.blacklist.length === 0) {
        return true;
      }

      const blacklistInterection = webhook.blacklist.filter(
        (keyword) => title.includes(keyword.toLowerCase()),
      );
      if (blacklistInterection.length) {
        return false;
      }

      const keywordsIntersection = webhook.keywords.filter(
        (keyword) => title.includes(keyword.toLowerCase()),
      );
      if (keywordsIntersection.length) {
        return true;
      }

      // if any of previous condiftion didn't match and webhook has keywords, do not execute
      if (webhook.keywords.length) {
        return false;
      }

      return true;
    });

    return webhooksToExecute;
  };

  public announceDeal = async (deal: Deal, allWebhooks: Webhook[]): Promise<ExecutionResult> => {
    const webhooksToRemove: Webhook[] = [];
    const rateLimitedWebhooks: Webhook[] = [];
    const failedWebhooks: Webhook[] = [];
    const badRequestWebhooks: Webhook[] = [];

    const message = Notifier.createMessageContent(deal);
    const webhooksToExecute = await this.getWebhooksToExecute(deal, allWebhooks);
    await Promise.allSettled(
      webhooksToExecute.map(async (webhook) => {
        const response = await this.discordClient.executeWebhook(webhook, message);
        if (response.statusCode === 404 || response.statusCode === 401) {
          webhooksToRemove.push(webhook);
        } else if (response.statusCode >= 500 && response.statusCode < 600) {
          this.logger.warn(response.body, 'Discord returned 5xx');
          failedWebhooks.push(webhook);
        } else if (response.statusCode === 429) {
          rateLimitedWebhooks.push(webhook);
        } else if (response.statusCode === 400) {
          badRequestWebhooks.push(webhook);
        }
      }),
    );

    return {
      webhooksToExecute,
      webhooksToRemove,
      rateLimitedWebhooks,
      failedWebhooks,
      badRequestWebhooks,
    };
  };

  public reportExecutionResult = async (
    executionResult: ExecutionResult,
    webhookUrl?: string,
  ) => {
    const content = `
Execution results (${new Date().toISOString()}):
Planned to execute: ${executionResult.webhooksToExecute.length}
Webhooks to remove: ${executionResult.webhooksToRemove.length}
Rate-limited: ${executionResult.rateLimitedWebhooks.length}
Failed to execute: ${executionResult.failedWebhooks.length}
Bad requests: ${executionResult.badRequestWebhooks.length};
`;
    this.logger.info(content);
    if (webhookUrl) {
      await got.post(webhookUrl, {
        searchParams: {
          wait: true,
        },
        json: {
          content,
        },
        throwHttpErrors: false,
      });
    }
  };

  public cleanupInvalidWebhooks = async (webhooks: Webhook[]) => {
    const cleanupResult = await Promise.allSettled(
      webhooks.map((webhook) => this.gdApiClient.removeWebhook(webhook)),
    );
    const successful = cleanupResult.filter((x) => x.status === 'fulfilled');
    this.logger.info(`Cleaning up ${webhooks.length} webhooks. Successfully removed ${successful.length} webhooks.`);
  };
}
