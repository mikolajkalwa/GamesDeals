import {
  CommandGenerator, CommandOptions,
} from 'eris';

const supportServer: { label: string, generator: CommandGenerator, options?: CommandOptions } = {
  label: 'support',
  generator: () => {
    if (process.env.SUPPORT_SERVER_URL) {
      return process.env.SUPPORT_SERVER_URL;
    }
    return 'Support Server invitation URL is not defined!';
  },
  options: {
    description: 'Support server invitation URL. This command works only in Direct Messages',
    dmOnly: true,
    aliases: ['sup', 'supp'],
  },
};

export default supportServer;
