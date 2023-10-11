
module.exports = async (client, menu) => {
    const { customId: ID, guildId, channelId, member } = menu;
    const guild = client.guilds.cache.get(guildId);
    const channel = client.channels.cache.get(channelId);

    if (ID === '') {}

};
  
module.exports.config = {
    Event: 'menuCreate', Development: false,
};