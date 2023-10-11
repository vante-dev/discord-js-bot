const { 
    PermissionsBitField: { Flags }, 
    ApplicationCommandOptionType: { Subcommand, SubcommandGroup, String, Integer, Boolean, } 
} = require('discord.js'); 


module.exports = {
    Name: 'language',
    Aliases: ['lang'],
    Description: 'Configure the bots language for this server.',
    Usage: 'language <language>',
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
    
    /**
     * Function to execute when the module is loaded.
     * @param {Client} client - The Discord bot client instance.
     * @returns {Promise<void>} Returns a promise that resolves when the module is loaded.
     * @async
     */
    onLoad: async (client) => {},

    /**
     * Function to execute when the command is triggered via a message.
     * @param {Client} client - The Discord bot client instance.
     * @param {Message} message - The Discord message object triggering the command.
     * @param {string[]} args - An array of arguments provided with the command.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    messageRun: async (client, message, args, settings) => {
        const language = client.languages.find((lang) => lang.name === args[0] || lang.aliases.includes(args[0]));

        if (!args[0] || !language) {
            const embed = client.embed(message, {
                color: "#fd003a",
                description: message.translate('misc:MISSING_LANGUAGE')
            })

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

    /**
     * Function to execute when the command is triggered via a slash command interaction.
     * @param {Client} client - The Discord bot client instance.
     * @param {CommandInteraction} interaction - The slash command interaction object.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    interactionRun: async (client, interaction, settings) => {},
};