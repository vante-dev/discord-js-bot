const { Events, ShardEvents } = require('discord.js');

module.exports = async (client, info) => {
    if (client.Vante.Debugger) client.logger.debug(info);
};
  
module.exports.config = {
    Event: Events.Debug, Development: true,
};