import got, { Response } from 'got';
import { inject, injectable } from 'tsyringe';
import { Webhook } from './types/Webhook';

export interface IDiscordClient {
  executeWebhook(webhook: Webhook, message: string): Promise<Response<string>>;
}

@injectable()
export class DiscordClient implements IDiscordClient {
  // generate array of 500, 501, ..., 599
  static readonly statusesToRetry = [...Array(100).keys()].map((x) => x + 500);

  constructor(@inject('discordBaseUrl') private readonly baseUrl: string) { }

  public executeWebhook = async (webhook: Webhook, message: string) => {
    let content = message;
    if (Object.prototype.hasOwnProperty.call(webhook, 'mention') && webhook.mention) {
      content = `<@&${webhook.mention}> ${message}`;
    }

    const response = await got.post(`${this.baseUrl}/api/webhooks/${webhook.id}/${webhook.token}`, {
      searchParams: {
        wait: true,
      },
      json: {
        content,
      },
      throwHttpErrors: false,
    });

    return response;
  };
}
