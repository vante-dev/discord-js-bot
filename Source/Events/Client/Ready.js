const { Events } = require("discord.js");
const { Presence } = require('../../../Global/Helpers');

module.exports = {
    Name: Events.ClientReady,
    System: true,

    execute: async (client) => { 
        for (const guild of [...client.guilds.cache.values()]) {
            await guild.fetchSettings();
            if (guild.settings == null) return client.emit('guildCreate', guild);
        }

        const data = await client.database.find('Guild');

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

        Presence(client);

        setInterval(async () => {
            const fetchSettingsPromises = [...client.guilds.cache.values()].map(guild => guild.fetchSettings());
            await Promise.all(fetchSettingsPromises);
            if (client.Vante.Debugger) client.logger.debug('All guilds have been initialized.');
        }, 60 * 1000);     
    },
};
