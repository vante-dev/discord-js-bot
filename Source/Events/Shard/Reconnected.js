const { Events, ShardEvents } = require('discord.js');

module.exports = async (client, error, id) => {
    client.logger.warn(`Shard ${id} Reconnected!`);
};
  
module.exports.config = {
    Event: ShardEvents.Reconnecting, Development: false,
};