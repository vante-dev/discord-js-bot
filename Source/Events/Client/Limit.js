const { EmbedBuilder } = require('discord.js');

module.exports = async (client, { route, timeout, limit, method }) => {
    client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);

    const embed = new EmbedBuilder()
	    .setTitle('RateLimit hit (TIMEOUT)')
		.addField('Path', route)
		.addField('Limit', `${limit}`)
		.addField('Cooldown', `${timeout}ms`)
        .addField('Method', `${method}`)
		.setTimestamp();
        
    const rateLimitLog = client.getWebhook('system');

    if (rateLimitLog) rateLimitLog.send({ 
        username: client.user.tag ? client.user.tag : 'Unknown Client', 
        avatarURL: client.user.displayAvatarURL(), 
        embeds: [embed] 
    })
};
  
module.exports.config = {
    Event: 'rateLimit', Development: false,
};