require('dotenv').config();
const { ShardingManager } = require('discord.js');
const util = require('util');
const logger = require('./lib/logger.js');

const manager = new ShardingManager('./bot.js', { token: process.env.BOT_TOKEN });

manager.spawn();

manager.on('launch', shard => logger.info(`Launched shard ${shard.id}`));
manager.on('message', (shard, message) => logger.info(`Shard[${shard.id}] : ${util.inspect(message)}`));
