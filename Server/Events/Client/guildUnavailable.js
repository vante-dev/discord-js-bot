const { Events } = require("discord.js");
const unavailableGuilds = [];

module.exports = async (client, guild) => {
    client.logger.debug(`Guild: ${guild.name} (${guild.id}) has become unavailable.`);

    if (unavailableGuilds.includes(guild.id)) {
        setTimeout(function() {
            unavailableGuilds.splice(unavailableGuilds.indexOf(guild.id), 1);
        }, 60 * 60 * 1000);
    } else {
        unavailableGuilds.push(guild.id);
    }
};
  
module.exports.config = {
    Event: Events.GuildUnavailable, System: true,
};