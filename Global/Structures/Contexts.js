const { ApplicationCommandType: { Message, User, ChatInput } } = require("discord.js");

module.exports = {
    Name: "",
    Description: "",
    Type: User,
    Cooldown: 0,
    Enabled: false,
    Ephemeral: false,

    Permissions: {
        Client: [],
        User: [],
    },

    async run(client, interaction) {

    },
};