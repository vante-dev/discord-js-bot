
module.exports = {
    Name: "",
    Aliases: [],
    Description: "",
    Usage: "",
    Category: "",
    Cooldown: 0,

    Authory: {
        Client: [],
        User: [],
    },
    
    Command: {
        Prefix: true,
        Slash: true,
        Ephemeral: true,
        Options: [],
    },

    onLoad: async (client) => {},

    messageRun: async (client, message, args) => {},

    interactionRun: async (client, interaction) => {},
};