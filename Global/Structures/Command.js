const { 
    PermissionsBitField: { Flags }, 
    ApplicationCommandOptionType: { Subcommand, SubcommandGroup, String, Integer, Boolean, } 
} = require('discord.js'); 


module.exports = {
    Name: '',
    Aliases: [''],
    Description: '',
    Usage: '',
    Category: '',
    Cooldown: 0,
    
    Permissions: {
        User: [],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: true,
        Ephemeral: true,
        Options: [],
    },

    /**
     * Function to execute when the command is triggered via a message.
     * @param {Client} client - The Discord bot client instance.
     * @param {Message} message - The Discord message object triggering the command.
     * @param {string[]} args - An array of arguments provided with the command.
     * @param {object} settings - An object of arguments provided with the command.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    messageRun: async (client, message, args, settings) => {},

    /**
     * Function to execute when the command is triggered via a slash command interaction.
     * @param {Client} client - The Discord bot client instance.
     * @param {CommandInteraction} interaction - The slash command interaction object.
     * @param {object} settings - An object of arguments provided with the command.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    interactionRun: async (client, interaction, settings) => {},
};