const { EmbedBuilder, AttachmentBuilder, ActivityType } = require('discord.js');
const { Events } = require("discord.js"), { green, red } = require("chalk");

module.exports = async (client, guild) => {
    client.logger.log(`( ${green(`GUILD JOIN`)} ) ${guild.name} (${guild.id}) added the bot.`);

    try {
        await guild.fetchSettings();
    } catch (err) {
        client.logger.error(`Event: '${this.config.Event}' has error: ${err.message}.`, {
            error: err,
            guild: guild,
            client: client
        });
    }
};
  
module.exports.config = {
    Event: Events.GuildCreate, System: true,
};