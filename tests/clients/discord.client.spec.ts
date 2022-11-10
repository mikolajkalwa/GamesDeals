import { DiscordClient } from '../../src/clients';

const discordClient = new DiscordClient('https://discord.com');

describe('executeWebhook', () => {
  if (!process.env['TEST_WEBHOOK_ID'] || !process.env['TEST_WEBHOOK_TOKEN']) {
    test.only('Required test configuration is missing!!!', () => {
      console.error('Required test configuration is missing!!!')
      expect(true).toBe(true)
    })
  }
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
