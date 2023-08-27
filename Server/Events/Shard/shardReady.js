module.exports = async (client, shardID, unavailableGuilds) => {
    client.logger.success(`Shard: ${shardID} has became ready with: ${(unavailableGuilds || new Set()).size} unavailable guilds.`);
};
  
module.exports.config = {
    Event: "shardReady", System: true,
};