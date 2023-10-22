const {  PermissionsBitField: { Flags }, EmbedBuilder } = require('discord.js'); 


module.exports = {
    Name: 'prefix',
    Aliases: [],
    Description: 'Configure the bots prefix for this server.',
    Usage: 'prefix <prefix>',
    Category: 'Admin',
    Cooldown: 30,
    
    Permissions: {
        User: [Flags.Administrator],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        
        Options: [],
    },

    messageRun: async (client, message, args, settings) => {
        const prefix = args[0]

        if (!args[0] || !prefix) {
            const embed = new EmbedBuilder({
                description: message.translate('misc:MISSING_PREFIX')
            })

            return message.channel.send({ embeds: [embed] })
        }

        try {
			await message.guild.updateGuild({ $set: { Prefix: [prefix] } });
            return message.channel.success('misc:PREFIX', { prefix: prefix });
        } catch (err) {
			message.channel.error('misc:ERROR_MESSAGE', { err: err.message })
		}
    },
};