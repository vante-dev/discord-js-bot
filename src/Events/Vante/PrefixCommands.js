const { Events } = require("discord.js");
const { Commands: { Message } } = require("@handlers/vante");
const { EmbedBuilder } = require("discord.js");
const { Time: { getReadableTime } } = require("@utils/vante");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    client.messagesSent++;

    if (client.Vante.Client.Commands) {
        if (message.content.includes(`${client.user.id}`)) {

            const promises = [
                message.client.shard.fetchClientValues("guilds.cache.size"),
                message.client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            ];

            return Promise.all(promises).then(async (results) => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

            const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setDescription([
                message.translate('misc:INTRO', { USER: client.user.username }),
                message.translate('misc:INFO',  { UPTIME: await getReadableTime(client.uptime), GUILDS: totalGuilds.toString(), USERS: totalMembers.toString(), CMDS: client.commands.size }),
                message.translate('misc:PREFIX', { PREFIX: client.Vante.Client.Prefix.listArray(message) }),
            ].join('\n\n'))
            .setFooter({ text: message.translate("misc:FOOTER", { CLIENT: client.user.tag, COMMANDS: client.commandsUsed, MESSAGES: client.messagesSent })})

            return message.channel.send({ embeds: [embed] }).then(x => { 
                setTimeout(() => { x.delete() }, 30000)
            });
        });
        }

        if (message.content && client.Vante.Client.Prefix.some(x => message.content.startsWith(x))) {
            Prefix = client.Vante.Client.Prefix; 
            let commands = message.content;

            Prefix.forEach(value => {
                if (commands.includes(value)) {
                    commands = commands.replace(value, "").split(/\s+/)[0];
                }
            });

            const cmd = client.commands.get(commands) || client.aliases.get(commands);
            if (cmd) Message(client, message, cmd);
        }
    }
};
  
module.exports.config = {
    Event: Events.MessageCreate, System: true,
};
