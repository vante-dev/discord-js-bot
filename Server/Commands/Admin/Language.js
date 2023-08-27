const { PermissionsBitField: { Flags } } = require('discord.js'); 

module.exports = {
    Name: 'language',
    Aliases: ['lang'],
    Description: 'Configure the bots language for this server.',
    Example: 'language <language>',
    Category: 'Admin',
    Cooldown: 0,

    Permissions: {
        User: [Flags.Administrator],
        Bot: [],
    },

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        Options: []
    },

    onLoad: async (client) => {},

    messageRun: async (client, message, args) => {
        const language = client.languages.find((lang) => lang.name === args[0] || lang.aliases.includes(args[0]));

        if (!args[0] || !language) {
            const embed = client.embed(message, {
                color: "#fd003a",
                description: message.translate('misc:MISSING_LANGUAGE')
            })

            return message.channel.send({ embeds: [embed] })
        }

        try {
			await message.guild.updateGuild({ language: language.name });
            message.guild.settings.Language = language.name;
            return message.channel.success('misc:LANGUAGE_SET', { language: language.nativeName });
        } catch (err) {
			message.channel.error('misc:ERROR_MESSAGE', { err: err.message })
		}

    },

    interactionRun: async (client, interaction) => {},
};
