import { Job } from 'bullmq';
import { GamesDealsApiClient } from 'gd-api-client';
import { Logger } from 'pino';
import { DiscordClient } from './clients';
import type { NotifyJob } from './types/notify-job.type';

export class Processor {
  readonly #gdApiClient: GamesDealsApiClient;
  readonly #discordClient: DiscordClient;
  readonly #logger: Logger;

  constructor(gdApiClient: GamesDealsApiClient, discordClient: DiscordClient, logger: Logger) {
    this.#gdApiClient = gdApiClient;
    this.#discordClient = discordClient;
    this.#logger = logger;
  }

  async executeWebhook(job: Job<NotifyJob>) {
    const response = await this.#discordClient.executeWebhook({ id: job.data.webhook.id, token: job.data.webhook.token }, job.data.content, job.data.threadName);
    const body = await response.body.text();

    if (response.statusCode === 404 || response.statusCode === 401) {
      await this.#gdApiClient.webhook.remove({ id: job.data.webhook.id })
        .catch((e) => { this.#logger.error(e, 'failed to delete webhook'); });
    } else if (response.statusCode >= 500 && response.statusCode < 600) {
      this.#logger.warn({ body, webhook: { id: job.data.webhook.id } }, 'Discord returned 5xx');
      throw new Error('Discord internal server error');
    } else if (response.statusCode === 429) {
      throw new Error('Webhook execution was ratelimited');
    } else if (response.statusCode === 400) {
      this.#logger.warn({ body, webhook: { id: job.data.webhook.id } }, 'Discord returned 400');
    }
  }
}
