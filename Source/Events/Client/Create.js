const { Events, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');

module.exports = async (client, guild) => {
    client.logger.debug(`${guild.name} (${guild.id}) added the bot.`);

    await guild.createDB();

    const owner = await guild.fetchOwner();

    const invite = await guild.channels.cache.find((c) =>
        c.type === ChannelType.GuildText &&
        c.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite && PermissionFlagsBits.SendMessages)
    );

    
    const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder() 
        .setLabel('Owner Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`discord://-/users/${owner.user.id}`),
    new ButtonBuilder()
        .setLabel('Server Invite')
        .setStyle(ButtonStyle.Link)
        .setDisabled(invite ? true : false)
        .setURL(`${invite ?? 'https://vante.dev/'}`)
    );

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.tag} (${client.user.id})`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`\`\`ansi\n[2;34mServer name: [2;37m[1;37m${guild.name} ( ${guild.id} )[0m[2;37m[0m[2;34m\nServer owner: [2;37m[1;37m@${owner.user.username} ( ${owner.user.id} )[0m[2;37m[0m[2;34m\nNumber of members: [2;37m[1;37m[1;37m${guild.memberCount}[0m[1;37m[0m[2;37m[0m[2;34m\nHumanos: [2;37m[1;37m${guild.members.cache.filter(member => !member.user.bot).size}[0m[2;37m[0m[2;34m\nBots: [2;37m[1;37m${guild.members.cache.filter(member => member.user.bot).size}[0m[2;37m[0m[2;34m[0m\n\`\`\``)
        .setColor('#4bd37b')
        .setFooter({ text: `SERVER ADDED`, iconURL: 'https://cdn.discordapp.com/emojis/1142616090728468531.png?size=96&quality=lossless' })
        .setTimestamp()

    const guildLogger = client.getWebhook('Server');

    if (guildLogger) {
        guildLogger.send({
            username: guild.name ??  'Unknown Guild', 
            avatarURL: guild.iconURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png', 
            embeds: [embed],
            components: [row],
        })
    }
};
  
module.exports.config = {
    Event: Events.GuildCreate, Development: true,
};