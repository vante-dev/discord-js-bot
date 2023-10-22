const { ShardingManager } = require('discord.js');
const { Bot } = require('../Global/Settings/Config');
const { Logger: { success } } = require('../Global/Handlers');

const manager = new ShardingManager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardList: 'auto',
    mode: 'process',
    token: Bot.Token,
});

manager.on('shardCreate', (shard) => 
    success(`[INFO] Launched Shard ${shard.id}`
));

manager.spawn({ timeout: -1 });
