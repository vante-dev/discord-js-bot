const { ApplicationCommandOptionType: { String }, EmbedBuilder } = require('discord.js'); 
const { Guild: { resolveMember }} = require("../../../Global/Helpers");

module.exports = {
    Name: 'test',
    Aliases: ['t'],
    Description: 'Test area',
    Example: '',
    Category: 'Root',
    Cooldown: 0,

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        Options: []
    },

    onLoad: async (client) => {},

    messageRun: async (client, message, args) => {
        const member = await resolveMember(message, "797096076330795018")
        message.channel.send({ content: `sa: \`${member}\` `})
    },

    interactionRun: async (client, interaction) => {},
};
