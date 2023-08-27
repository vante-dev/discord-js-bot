module.exports = async (client, error, shardID) => {
    client.logger.error(`Shard: ${shardID} encounted error: ${error}`);
};
  
module.exports.config = {
    Event: "shardError", System: true,
};