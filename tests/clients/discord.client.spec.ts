import { DiscordClient } from '../../src/clients';

const discordClient = new DiscordClient('https://discord.com');

describe('executeWebhook', () => {
  if (!process.env['TEST_TEXT_CHANNEL_WEBHOOK_ID'] || !process.env['TEST_TEXT_CHANNEL_WEBHOOK_TOKEN'] ||
      !process.env['TEST_FORUM_CHANNEL_WEBHOOK_ID'] || !process.env['TEST_FORUM_CHANNEL_WEBHOOK_TOKEN']) {
    test.only('Required test configuration is missing!!!', () => {
      console.error('Required test configuration is missing!!!')
      expect(true).toBe(true)
    })
  }
  it('should be possible to execute guild text channel webhook', async () => {
    const webhookExecute = discordClient.sendNotification({
      blacklist: [],
      keywords: [],
      guild: '',
      channelType: 'GUILD_TEXT',
      id: process.env['TEST_TEXT_CHANNEL_WEBHOOK_ID']!,
      token: process.env['TEST_TEXT_CHANNEL_WEBHOOK_TOKEN']!,
    }, {
      author: 'Automatic test',
      id: 'x9w0jh',
      over18: false,
      title: `Notifier - Execute webhook test, ${new Date()}`,
      url: 'https://www.reddit.com/r/ProgrammerHumor'
    })

    await expect(webhookExecute).resolves.toMatchObject({ statusCode: 200 });
  })

  it('should be possible to execute guild forum channel webhook', async () => {
    const webhookExecute = discordClient.sendNotification({
      blacklist: [],
      keywords: [],
      guild: '',
      channelType: 'GUILD_FORUM',
      id: process.env['TEST_FORUM_CHANNEL_WEBHOOK_ID']!,
      token: process.env['TEST_FORUM_CHANNEL_WEBHOOK_TOKEN']!,
    }, {
      author: 'Automatic test',
      id: 'x9w0jh',
      over18: false,
      title: `Notifier - Execute webhook test, ${new Date()}`,
      url: 'https://www.reddit.com/r/ProgrammerHumor'
    })

    await expect(webhookExecute).resolves.toMatchObject({ statusCode: 200 });
  })
})
