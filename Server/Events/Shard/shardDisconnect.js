module.exports = async (client, event, shardID) => {
    client.logger.error(`Shard: ${shardID} disconnected with error: ${event.reason}`);
};
  
module.exports.config = {
    Event: "shardDisconnect", System: true,
};