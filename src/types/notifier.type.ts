import type { Webhook } from './games-deal-api.type';

export interface ExecutionResult {
  webhooksToExecute: Webhook[];
  webhooksToRemove: Webhook[];
  rateLimitedWebhooks: Webhook[];
  failedWebhooks: Webhook[];
  badRequestWebhooks: Webhook[];
}
