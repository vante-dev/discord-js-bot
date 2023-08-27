const { Events } = require("discord.js");

module.exports = async (client, info) => {
    client.logger.log(`warn: \n${info}`);
};
  
module.exports.config = {
    Event: Events.Warn, System: true,
};