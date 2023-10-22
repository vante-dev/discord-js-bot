const { Events } = require('discord.js');

module.exports = async (client, info) => {
    client.logger.warn(info)
};
  
module.exports.config = {
    Event: Events.Warn, Development: false,
};