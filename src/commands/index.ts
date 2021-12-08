import InteractionDefinition from '../lib/InteractionDefinition';
import ping from './ping';

const commands = new Map<string, InteractionDefinition>();

commands.set('ping', ping);

export default commands;
