import { Message, GuildChannel } from 'eris';
import CommandDefinition from '../lib/CommandDefinition';

const pingCommand: CommandDefinition = {
  label: 'ping',
  generator: async (msg: Message) => {
    const msg2 = await msg.channel.createMessage('**Pong!** :ping_pong:');
    msg2.edit(
      '**Pong!** :ping_pong:\n'
      + `Shard latency: ${(msg2.channel as GuildChannel).guild.shard.latency}ms\n`
      + `Discord API: ${msg2.timestamp - msg.timestamp}ms`,
    );
  },
  options: {
    aliases: ['pong'],
    description: 'Pong!',
    fullDescription: 'Ping the bot to see if there are latency issues.',
    guildOnly: true,
  },
};

export default pingCommand;
