const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js'); 

module.exports = {
    Name: 'language',
    Aliases: ['lang'],
    Description: 'Configure the bots language for this server.',
    Usage: 'language <language>',
    Category: 'Admin',
    Cooldown: 30,
    
    Permissions: {
        User : [Flags.Administrator],
    },

    Command: {
        Prefix: true,
    },

    messageRun: async (client, message, args, settings) => {
        const language = client.languages.find((lang) => lang.name === args[0] || lang.aliases.includes(args[0]));

        if (!args[0] || !language) {
            const embed = new EmbedBuilder({
                description: message.translate('misc:MISSING_LANGUAGE')
            });

            return message.channel.send({ embeds: [embed] })
        }

        try {
			await message.guild.updateGuild({ $set: { Language: language.name } });
            message.guild.settings.Language = language.name;
            return message.channel.success('misc:LANGUAGE_SET', { language: language.nativeName });
        } catch (err) {
			message.channel.error('misc:ERROR_MESSAGE', { err: err.message })
		}
    },

    interactionRun: async (client, interaction, settings) => {},
};