module.exports = async (client, button) => {
    const { customId: ID, guildId, channelId, member } = button;
    const guild = client.guilds.cache.get(guildId);
    const channel = client.channels.cache.get(channelId);

    if (ID == '') {}
};
  
module.exports.config = {
    Event: 'buttonCreate', Development: false,
};