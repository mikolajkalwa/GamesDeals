import { Webhook } from './GamesDealsApi';

export interface ExecutionResult {
  webhooksToExecute: Webhook[];
  webhooksToRemove: Webhook[];
  rateLimitedWebhooks: Webhook[];
  failedWebhooks: Webhook[];
  badRequestWebhooks: Webhook[];
}
