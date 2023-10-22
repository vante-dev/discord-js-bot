const { Events, ShardEvents } = require('discord.js');

module.exports = async (client, id) => {
    client.logger.success(`Shard ${id} is ready!`);
};
  
module.exports.config = {
    Event: ShardEvents.Ready, Development: true,
};