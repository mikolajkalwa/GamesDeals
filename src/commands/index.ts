import InteractionDefinition from '../lib/InteractionDefinition';
import ping from './ping';
import createWebhook from './createWebhook';
import editWebhook from './editWebhook';
import latestDeal from './latestDeal';

const commands = new Map<string, InteractionDefinition>();

commands.set(ping.name, ping);
commands.set(createWebhook.name, createWebhook);
commands.set(editWebhook.name, editWebhook);
commands.set(latestDeal.name, latestDeal);

export default commands;
