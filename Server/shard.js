 const { ShardingManager, DiscordAPIError } = require('discord.js');
const { Logger: { error } } = require("../Global/Helpers"), { Client } = require("../Global/System");

(async () => {
    const manager = new ShardingManager(`${__dirname}/index.js`, {
        token: Client.Token,
        totalShards: 2,
        shardArgs: ['--ansi', '--color'],
        mode: 'process',
        timeout: 90000,
        respawn: true,
    });

    process.on('unhandledRejection', (reason) => {
        if (reason instanceof DiscordAPIError) return
        error(`${reason}`)
    });

    await manager.spawn({ timeout: -1 }).catch(e => error(`Shard Error: ` + e))
})();