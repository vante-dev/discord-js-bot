const { Events, ShardEvents } = require('discord.js');

module.exports = async (client, error, ID) => {
    client.logger.warn(`Shard ${ID} Shard Disconnected!`);

};
  
module.exports.config = {
    Event: ShardEvents.Disconnect, Development: false,
};