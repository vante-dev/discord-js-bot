require("folder-connect/vante");

const { ShardingManager, DiscordAPIError, EmbedBuilder, WebhookClient } = require('discord.js');
const Logger = require("@utils/Logger"), Vante = require("@root/System");
const ManagerSettings = Vante.Functions.ShardingManager

const manager = new ShardingManager(`${__dirname}/Vante.js`, {
    token: Vante.Client.Token,
    totalShards: ManagerSettings.totalShards,
    shardList: ManagerSettings.shardList,
    shardArgs: ManagerSettings.shardArgs,
    mode: ManagerSettings.mode,
    timeout: ManagerSettings.timeout,
    respawn: ManagerSettings.respawn,
}); 

const webhookLogger = Vante.Functions.Webhook.Logger && Vante.Functions.Webhook.Shards ? new WebhookClient({ url: Vante.Functions.Webhook.Shards }) : undefined;

Logger.debug(`Creating shading manager and shards...`)

process.on('unhandledRejection', (reason) => {
    if (reason instanceof DiscordAPIError) return
    console.error(reason)
});

manager.on('shardCreate', shard => {
    let embed = new EmbedBuilder()
        .setTitle(`🆙・Launching shard`)
        .setDescription(`A shard has just been launched`)
        .setFields([
            {
                name: "ID",
                value: `${shard.id + 1}/${manager.totalShards}`,
                inline: true
            }
        ])

    webhookLogger.send({
        username: 'Vante Logs',
        embeds: [embed],
    });

    Logger.debug(`Starting Shard #${shard.id + 1}...`)

    shard.on("death", (process) => {
        let embed = new EmbedBuilder()
        .setTitle(`🚨・Closing shard ${shard.id + 1}/${manager.totalShards} unexpectedly`)
        .setFields([
            {
                name: "ID",
                value: `${shard.id + 1}/${manager.totalShards}`,
                inline: true
            }
        ])

        webhookLogger.send({
            username: 'Vante Logs',
            embeds: [embed],
        });

        if (process.exitCode === null) {
            let embed = new EmbedBuilder()
            .setTitle(`🚨・Shard ${shard.id + 1}/${manager.totalShards} exited with NULL error code!`)
            .setFields([
                {
                    name: "PID",
                    value: `\`${process.pid}\``,
                },
                {
                    name: "Exit code",
                    value: `\`${process.exitCode}\``,
                }
            ])

            webhookLogger.send({
                username: 'Vante Logs',
                embeds: [embed],
            });
        };
    });

    shard.on("shardDisconnect", (event) => {
        let embed = new EmbedBuilder()
            .setTitle(`🚨・Shard ${shard.id + 1}/${manager.totalShards} disconnected`)

        webhookLogger.send({
            username: 'Vante Logs',
            embeds: [embed],
        });
    });

    shard.on("shardReconnecting", () => {
        let embed = new EmbedBuilder()
            .setTitle(`🚨・Reconnecting shard ${shard.id + 1}/${manager.totalShards}`)

        webhookLogger.send({
            username: 'Vante Logs',
            embeds: [embed],
        });
    });
});

manager.spawn();


