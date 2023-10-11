
module.exports = {
    Name: 'blacklist',
    Aliases: ['bl'],
    Description: 'Adds a user/servver to the blacklist.',
    Usage: 'blacklist user/guild <ID> <reason>',
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

        if (args.length < 1)
            return message.reply(`Please provide me with a user or guild blacklist [{prefix} blacklist <user | guild> <actual user or guild>. Example: {prefix} blacklist user @user]`);

        if (args.length < 2)
            return message.channel.sendCustom(`Provide me with a user/guild`);

        if (args[0] === "user") {
            let member;
            try {
                member = message.mentions.members.first().id || args[1]
            } catch {
                return message.reply(`Provide me a user`);
            }

            const database = await client.database.findOne('Cluster', 'Vante', { clientID: client.user.id });
            if (database && database.Users && database.Users.includes(member)) {
                await client.database.updateOne('Cluster', 'Vante', { clientID: client.user.id }, { $pull: { Users: member, } });
                message.channel.send({ content: 'User removed from the blacklist!'});
            } else {
                await client.database.updateOne('Cluster', 'Vante', { clientID: client.user.id }, { $push: { Users: member }}, { upsert: true});
                message.channel.send({ content: 'User added to the blacklist!'});
            }
        } else if (args[0] === "guild") {
            const database = await client.database.findOne('Cluster', 'Vante', { clientID: client.user.id });

            if (database && database.Servers && database.Servers.includes(member)) {
                await client.database.updateOne('Cluster', 'Vante', { clientID: client.user.id }, { $pull: { Servers: args[1], } });
                message.channel.send({ content: 'User removed from the blacklist!'});
            } else {
                await client.database.updateOne('Cluster', 'Vante', { clientID: client.user.id }, { $push: { Servers: args[1] } }, { upsert: true});
                message.channel.send({ content: 'User added to the blacklist!'});
            }
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