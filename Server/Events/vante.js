const { Events, EmbedBuilder } = require("discord.js");
const { Time: { getReadableTime } } = require("../../Global/Helpers")


module.exports = async (client, message) => {
    if (message.content.includes(`${client.user.id}`)) {
        const promises = [
            message.client.shard.fetchClientValues("guilds.cache.size"),
            message.client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];

        return Promise.all(promises).then(async (results) => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

            const embed = new EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setDescription([
                message.translate('misc:INTRO', { USER: client.user.username }),
                message.translate('misc:INFO',  { UPTIME: getReadableTime(client.uptime), GUILDS: totalGuilds.toString(), USERS: totalMembers.toString(), CMDS: client.commands.size }),
                message.translate("misc:FOOTER", { CLIENT: client.user.tag, COMMANDS: client.commandsUsed, MESSAGES: client.messagesSent, PREFIX: client.Vante.Prefix }),
            ].join('\n\n'))
            
            return await message.channel.send({ embeds: [embed]})
        });
    };
};
  
module.exports.config = {
    Event: Events.MessageCreate, System: true,
};
