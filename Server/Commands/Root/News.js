
module.exports = {
    Name: 'setnews',
    Aliases: [],
    Description: 'This is for the developers.',
    Usage: 'setnews <text>',
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
        let news = args.join(" ").split("").join("");
        if (!news) return message.channel.send("Please enter news.");

        const vante = await client.database.updateOne('Cluster', 'Vante', { clientID: client.user.id }, { $set: {
            news: news,
            time: Date.now(),
        }
        }, { upsert: true, new: true });
        
        return message.channel.send("News setted.");
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