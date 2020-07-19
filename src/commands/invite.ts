import {
  CommandGenerator, CommandOptions,
} from 'eris';

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
    description: 'Bot invitation URL. This command works only in Direct Messages',
    dmOnly: true,
  },
};

export default inviteCommand;
