const { Events, ShardEvents } = require('discord.js');

module.exports = async (client, error, id) => {
    client.logger.error(`Shard ${id} Errored!`);
};
  
module.exports.config = {
    Event: ShardEvents.Error, Development: false,
};