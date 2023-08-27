const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { Client: { createDB, getWebHook } } = require("../../../Global/Helpers");

module.exports = async (client, guild) => {
    client.logger.debug(`${guild.name} (${guild.id}) added the bot.`);

    await createDB(guild, client);

    const settings = guild.settings;
    if (Object.keys(settings).length == 0) return;

    const owner = await guild.fetchOwner();
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Owner Profile')
            .setStyle(ButtonStyle.Link)
            .setURL(`discord://-/users/${owner.user.id}`)
    );

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.tag} (${client.user.id})`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`\`\`ansi\n[2;34mServer name: [2;37m[1;37m${guild.name} ( ${guild.id} )[0m[2;37m[0m[2;34m\nServer owner: [2;37m[1;37m@${owner.user.username} ( ${owner.user.id} )[0m[2;37m[0m[2;34m\nNumber of members: [2;37m[1;37m[1;37m${guild.memberCount}[0m[1;37m[0m[2;37m[0m[2;34m\nHumanos: [2;37m[1;37m${guild.members.cache.filter(member => !member.user.bot).size}[0m[2;37m[0m[2;34m\nBots: [2;37m[1;37m${guild.members.cache.filter(member => member.user.bot).size}[0m[2;37m[0m[2;34m[0m\n\`\`\``)
        .setColor('#4bd37b')
        .setFooter({ text: `SERVER ADDED | SERVER ID: ${guild.id}`, iconURL: "https://cdn.discordapp.com/emojis/1142616090728468531.png?size=96&quality=lossless" })
        .setTimestamp()
        .setThumbnail(guild.iconURL());

    const guildLogger = getWebHook("System");

    if (guildLogger) {
        guildLogger.send({
            username: guild.name ? guild.name + `( ${guild.id} )` : 'Unknown Guild', 
            avatarURL: guild.iconURL() ? guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/1.png", 
            embeds: [embed],
            components: [row]
        })
    }
};

module.exports.config = {
    Event: Events.GuildCreate, System: true,
};