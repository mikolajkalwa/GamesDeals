import InteractionDefinition from '../lib/InteractionDefinition';
import ping from './ping';
import createWebhook from './createWebhook';
import editWebhook from './editWebhook';

const commands = new Map<string, InteractionDefinition>();

commands.set('ping', ping);
commands.set('createwebhook', createWebhook);
commands.set('editwebhook', editWebhook);

export default commands;
