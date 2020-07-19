import CommandDefinition from '../lib/CommandDefinition';

const inviteCommand: CommandDefinition = {
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
