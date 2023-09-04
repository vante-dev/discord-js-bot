const { PermissionsBitField: { Flags } } = require('discord.js'); 

module.exports = {
    Name: 'prefix',
    Aliases: [],
    Description: 'Configure the bots prefix for this server.',
    Example: 'prefix <prefix>',
    Category: 'Admin',
    Cooldown: 0,

    Permissions: {
        User: [Flags.Administrator],
    },

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        Options: []
    },

    onLoad: async (client) => {},

    messageRun: async (client, message, args) => {
        const oldPrefix = message.guild.settings.prefix;
        const newPrefix = args[0];

        if (!newPrefix) return message.channel.error('misc:INCORRECT_FORMAT', { 
            commandExample: message.translate('misc:HELP_INFO', { 
                USAGE: oldPrefix + client.commands.find(command => command.Name == "prefix").Example
            })
        })

        if (newPrefix.length > 3) return message.channel.send(message.translate('misc:PREFIX_LENGTH'));

        await message.guild.updateGuild({ prefix: [newPrefix] })

        const embed = client.embed(message, {
            title: message.translate('misc:PREFIX', {
                OLD: oldPrefix,
                NEW: newPrefix
            })
        })

        message.channel.send({ embeds: [embed] })
    },

    interactionRun: async (client, interaction) => {},
};
