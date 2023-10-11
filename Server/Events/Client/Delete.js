const { Events, ShardEvents } = require("discord.js");

module.exports = async (client, guild) => {
    client.logger.debug(`${guild.name} (${guild.id}) removed the bot.`);

    await guild.deleteDB();

    const settings = guild.settings;
    if (Object.keys(settings).length == 0) return;
    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.tag} (${client.user.id})`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`\`\`ansi\n[2;34mServer name: [2;37m[1;37m${guild.name ?? 'undefined'} ( ${guild.id} )[0m[2;37m[0m[2;34m\nServer owner: [2;37m[1;37m@${client.users.fetch(guild.ownerId)?.username}[0m[2;37m[0m[2;34m\nNumber of members: [2;37m[1;37m[1;37m${guild?.memberCount ?? 'undefined'}[0m[1;37m[0m[2;37m[0m\n\`\`\``)
        .setColor('#fd003a')
        .setFooter({ text: `SERVER LEAVED`, iconURL: "https://cdn.discordapp.com/emojis/1147982222939410473.webp?size=128&quality=lossless" })
        .setTimestamp()

    const guildLogger = client.getWebhook("Server");

    if (guildLogger) {
        guildLogger.send({
            username: guild.name ? guild.name + `( ${guild.id} )` : 'Unknown Guild',
            avatarURL: guild.iconURL() ? guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/1.png",
            embeds: [embed]
        })
    };
};

module.exports.config = {
    Event: Events.GuildDelete, Development: false,
};