module.exports.run = async (client, interaction) => {
    const { customId: ID, guildId, channelId, member } = button;
    const guild = client.guilds.cache.get(guildId);
    const channel = client.channels.cache.get(channelId);

    if (ID == '') {}
}