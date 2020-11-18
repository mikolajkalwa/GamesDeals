import got from 'got';
import { ExecutionResult } from '../models/ExecutionResult';

const reportExecutionResult = async (
  webhookUrl: string | undefined,
  mention: string | undefined,
  executionResult: ExecutionResult,
) => {
  if (!webhookUrl) { return; }

  let content = `**Webhooks execution ${new Date().toISOString()}**
    Webhooks to remove: ${executionResult.webhooksToRemove.length}
    Rate-limited: ${executionResult.rateLimitedWebhooks.length}
    Failed to execute: ${executionResult.failedWebhooks.length}
    Bad requests: ${executionResult.badRequestWebhooks.length}`;

  if (mention && executionResult.rateLimitedWebhooks.length > 0) {
    content += mention;
  }

  got.post(webhookUrl, {
    json: {
      content,
    },
    throwHttpErrors: false,
  });
};

export default reportExecutionResult;
