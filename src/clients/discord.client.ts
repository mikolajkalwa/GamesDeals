import { Pool } from 'undici';
import type { Deal, Webhook } from '../types/games-deal-api.type';

export class DiscordClient {
  private readonly client: Pool;

  constructor(private readonly baseUrl: string) {
    this.client = new Pool(this.baseUrl, {
      pipelining: 10,
      connections: 128,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private appendMentionToMessage = (webhook: Webhook, message: string) => {
    if (Object.prototype.hasOwnProperty.call(webhook, 'mention') && webhook.mention) {
      if (webhook.mention === webhook.guild) {
        return `${message}@everyone`;
      }
      return `${message}<@&${webhook.mention}>`;
    }
    return message;
  };

  // eslint-disable-next-line arrow-body-style
  private executeWebhook = async (webhook: Webhook, content: string, threadName?: string) => {
    return await this.client.request({
      path: `/api/webhooks/${webhook.id}/${webhook.token}?wait=true`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thread_name: threadName,
        content,
      }),
    });
  };

  private executeTextChannelWebhook = async (webhook: Webhook, deal: Deal) => {
    const message = `**${deal.title}**\n<${deal.url}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.id}\n`;
    const content = this.appendMentionToMessage(webhook, message);

    return await this.executeWebhook(webhook, content);
  };

  private executeForumChannelWebhook = async (webhook: Webhook, deal: Deal) => {
    const message = `<${deal.url}>\nPosted by: *${deal.author}*\nhttps://reddit.com/${deal.id}\n`;
    const content = this.appendMentionToMessage(webhook, message);

    return await this.executeWebhook(webhook, content, deal.title);
  };

  public sendNotification = async (webhook: Webhook, deal: Deal) => {
    if (webhook.channelType === 'GUILD_FORUM') {
      return await this.executeForumChannelWebhook(webhook, deal);
    }

    return await this.executeTextChannelWebhook(webhook, deal);
  };
}
