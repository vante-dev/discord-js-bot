const { Events } = require("discord.js");

module.exports = {
    Name: Events.Debug,
    System: true,

    execute: async (client, info) => { 
        if (client.Vante.Debugger) client.logger.debug(info);
    }
};
