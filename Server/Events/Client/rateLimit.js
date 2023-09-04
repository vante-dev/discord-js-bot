const { EmbedBuilder } = require("discord.js");

module.exports = async (client, { route, timeout, limit }) => {
    client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);

    const embed = new EmbedBuilder()
    .setTitle('RateLimit hit')
	.addField('Path', route)
	.addField('Limit', `${limit}`, true)
	.addField('Cooldown', `${timeout}ms`, true)
    .setTimestamp();

    const log = client.getWebHook("System");

    if (log) log.send({
        username: client.user.username ? client.user.username + `( ${client.user.id} )` : 'Unknown Guild', 
        avatarURL: client.user.displayAvatarURL() ? client.user.displayAvatarURL() : "https://cdn.discordapp.com/embed/avatars/1.png", 
        embeds: [embed],
    })
};
  
module.exports.config = {
    Event: "RateLimit", System: true,
};