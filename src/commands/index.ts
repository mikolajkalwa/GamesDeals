import InteractionDefinition from '../lib/InteractionDefinition';
import ping from './ping';
import createWebhook from './createWebhook';
import editWebhook from './editWebhook';
import latestDeal from './latestDeal';
import webhookInfo from './webhookInfo';
import statistics from './statistics';

const commands = new Map<string, InteractionDefinition>();

commands.set(ping.name, ping);
commands.set(createWebhook.name, createWebhook);
commands.set(editWebhook.name, editWebhook);
commands.set(latestDeal.name, latestDeal);
commands.set(webhookInfo.name, webhookInfo);
commands.set(statistics.name, statistics);

export default commands;
