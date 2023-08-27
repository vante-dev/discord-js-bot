module.exports = async (client, shardID) => {
    client.logger.success(`Shard: ${shardID} is attempting to reconnect.`);
};
  
module.exports.config = {
    Event: "shardReconnecting", System: true,
};