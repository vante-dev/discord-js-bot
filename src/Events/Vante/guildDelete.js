const { Events } = require("discord.js"), { green, red } = require("chalk");

module.exports = async (client, guild) => {
    client.logger.log(`( ${red(`GUILD LEFT`)} ) ${guild.name} (${guild.id}) added the bot.`);
    await client.deleteGuild(guild);
};
  
module.exports.config = {
    Event: Events.GuildDelete, System: true,
};