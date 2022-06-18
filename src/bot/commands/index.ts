import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import CommandHandler from './command-handler.type';
import * as webhook from './webhook';
import * as latest from './latest';
import * as ping from './ping';
import * as statistics from './statistics';
import * as help from './help';

const commands = new Map<string, {
  handler: CommandHandler,
  definition: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder
}>();

commands.set(webhook.definition.name, {
  definition: webhook.definition,
  handler: webhook.handler,
});

commands.set(latest.definition.name, {
  definition: latest.definition,
  handler: latest.handler,
});

commands.set(ping.definition.name, {
  definition: ping.definition,
  handler: ping.handler,
});

commands.set(statistics.definition.name, {
  definition: statistics.definition,
  handler: statistics.handler,
});

commands.set(help.definition.name, {
  definition: help.definition,
  handler: help.handler,
});

export default commands;
