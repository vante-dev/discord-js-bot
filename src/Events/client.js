const { Events } = require("discord.js");
const { GuildSchema } = require('@schemas/vante');

module.exports = async (client) => {
    for (const guild of [...client.guilds.cache.values()]) {
        await guild.fetchSettings();
        if (guild.settings == null) return client.emit('guildCreate', guild);
    }

    const data = await GuildSchema.find({});
    if (data.length > client.guilds.cache.size) {
	    const guildCount = [];
		for (let i = 0; i < client.guilds.cache.size; i++) {
			guildCount.push([...client.guilds.cache.values()][i].id);
		}
			
        for (const guild of data) {
			if (!guildCount.includes(guild.guildID)) {
				client.emit('guildDelete', { id: guild.guildID, name: guild.guildName });
			}
		}
	}

    setInterval(async () => {
        client.logger.log('Fetching guild settings (Interval: 1 minutes)');
        client.guilds.cache.forEach(async guild => {
            await guild.fetchSettings();
        });
    }, 60000);
};
  
module.exports.config = {
    Event: Events.ClientReady, System: true,
};