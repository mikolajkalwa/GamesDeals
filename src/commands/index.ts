import InteractionDefinition from '../lib/InteractionDefinition';
import ping from './ping';
import createWebhook from './createWebhook';

const commands = new Map<string, InteractionDefinition>();

commands.set('ping', ping);
commands.set('createwebhook', createWebhook);

export default commands;
