module.exports = {
    Name: 'leave',
    Aliases: ['fleave', 'forceleave', 'leaveguild', 'removeguild', 'leaveserver'],
    Description: 'Force the bot to leave the server',
    Usage: 'leave <ServerID>',
    Category: 'Root',
    Cooldown: 0,

    Permissions: {
        User: [],
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
        const guildId = args[0];

        if (!guildId) {
            return message.channel.send(`You have to give me some serverID to run!`)
        }

        const guild = client.guilds.cache.find((g) => g.id === guildId);

        if (!guild) {
            return message.channel.send(`Sorry, ${message.author}. server not found`)
        }

        try {
            await guild.leave();
            message.channel.send(`I successfully logged out of the **${guild.name}** server.`)
        } catch (err) {
            message.channel.send(`"The following error has occurred: **${err}**.`)
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