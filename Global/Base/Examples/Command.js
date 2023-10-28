const {  PermissionsBitField: { Flags }, ApplicationCommandOptionType } = require('discord.js'); 

module.exports = {
    Name: '',
    Aliases: [''],
    Description: '',
    Usage: '',
    Category: '',
    Cooldown: 0,
    
    Permissions: {
        User : [],
        Bot  : [],
        Role : []
    },

    Command: {
        Prefix    : true,
        Slash     : true,
        Ephemeral : true,
        Options   : [],
    },

    messageRun: async (client, message, args, settings) => {},

    interactionRun: async (client, interaction, settings) => {},
};