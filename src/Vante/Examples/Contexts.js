const { ApplicationCommandType } = require("discord.js");

module.exports = {
    Name: "",
    Description: "",
    Type: ApplicationCommandType,
    Cooldown: 0,
    Enabled: false,
    Ephemeral: false,

    Authory: {
        Client: [],
        User: [],
    },

    async run(client, interaction) {

    },
};
