import {
  CommandGenerator, CommandOptions,
} from 'eris';
import Time from '../lib/Time';

const inviteCommand: { label: string, generator: CommandGenerator, options?: CommandOptions } = {
  label: 'invite',
  generator: () => {
    if (process.env.INVITE_URL) {
      return process.env.INVITE_URL;
    }
    return 'Invite URL is not defined!';
  },
  options: {
    aliases: ['inv'],
    cooldown: Time.MINUTE,
    description: 'Bot invitation URL. This command works only in Direct Messages',
    dmOnly: true,
  },
};

export default inviteCommand;
