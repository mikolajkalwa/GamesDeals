import { DiscordClient } from '../../src/clients';

const discordClient = new DiscordClient('https://discord.com');

describe('executeWebhook', () => {
  it('should be possible to execute webhook', async () => {

    const webhookExecute = discordClient.executeWebhook({
      blacklist: [],
      keywords: [],
      guild: '',
      id: process.env['TEST_WEBHOOK_ID']!,
      token: process.env['TEST_WEBHOOK_TOKEN']!,
    }, `Notifier - Execute webhook test, ${new Date()}`)

    await expect(webhookExecute).resolves.toMatchObject({ statusCode: 200 });
  })
})
