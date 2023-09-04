const { ShardingManager, DiscordAPIError } = require('discord.js');
const { Logger: { error } } = require("../Global/Helpers"), Settings = require("../Global/System");

const manager = new ShardingManager(`${__dirname}/index.js`, {
    token: Settings.Client.Token,
    totalShards: 'auto',
    shardList: 'auto',
    shardArgs: ['--ansi', '--color'],
    mode: 'process',
    timeout: 87398,
    respawn: true,
}); 

process.on('unhandledRejection', (reason) => {
    if (reason instanceof DiscordAPIError) return
    error(reason)
});

manager.spawn({ timeout: -1 });
