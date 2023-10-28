const { Events } = require("discord.js");

module.exports = {
    Name: Events.Error,
    System: true,

    execute: async (client, error) => {     
        const guild = await client.guilds.fetch(client.system.serverID ? client.system.serverID : '1337');

        if (guild) {
            client.logger.error(`Client encountered an error: ${error.message}`, { 
                error: error,
                guild: guild,
                client: client
            });
        } else {
            client.logger.error(`Client encountered an error: ${error.message}\n${error}`);
        };
    }
};
