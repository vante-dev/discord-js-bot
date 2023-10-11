const { Events } = require("discord.js");
const { Presence } = require("../../../Global/Helpers")

module.exports = async (client) => {

    for (const guild of [...client.guilds.cache.values()]) {
        await guild.fetchSettings();
        if (guild.settings == null) return client.emit('guildCreate', guild);
    }

    const data = await client.database.find('Cluster', 'Guild', {});

    if (data.length > client.guilds.cache.size) {
        const guildCount = [];
        for (let i = 0; i < client.guilds.cache.size; i++) {
            guildCount.push([...client.guilds.cache.values()][i].id);
        }

        for (const guild of data) {
            if (!guildCount.includes(guild.guildID)) {
                client.emit('guildDelete', guild);
            }
        }
    }

    client.logger.success('All guilds have been initialized.');

    setInterval(async () => {
        client.guilds.cache.forEach(async guild => {
            await guild.fetchSettings();
        });
    }, 60 * 1000);

    Presence(client)
};
  
module.exports.config = {
    Event: Events.ClientReady, Development: false,
};