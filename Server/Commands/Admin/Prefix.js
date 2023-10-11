const { 
    PermissionsBitField: { Flags }, 
    ApplicationCommandOptionType: { Subcommand, SubcommandGroup, String, Integer, Boolean, } 
} = require('discord.js'); 


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
        const prefix = args[0]

        if (!args[0] || !prefix) {
            const embed = client.embed(message, {
                color: "#fd003a",
                description: message.translate('misc:MISSING_PREFIX')
            })

            return message.channel.send({ embeds: [embed] })
        }

        try {
			await message.guild.updateGuild({ $set: { Prefix: [prefix] } });
            return message.channel.success('misc:PREFIX_SET', { prefix: prefix });
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