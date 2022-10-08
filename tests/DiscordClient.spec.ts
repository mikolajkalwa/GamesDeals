import DiscordClient from '../src/DiscordClient';

const discordClient = new DiscordClient('https://discord.com');

describe('executeWebhook', () => {
  it('should be possible to execute webhook', async () => {

    const webhookExecute = discordClient.executeWebhook({
      blacklist: [],
      keywords: [],
      guild: '',
      id: process.env['TEST_WEBHOOK_ID'] as string,
      token: process.env['TEST_WEBHOOK_TOKEN'] as string,
    }, `Notifier - Execute webhook test, ${new Date()}`)

    await expect(webhookExecute).resolves.toMatchObject({ statusCode: 200 });
  })
})
