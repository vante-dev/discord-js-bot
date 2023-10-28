const { Events } = require("discord.js");
const { Command: { MessageCommandsHandler } } = require("../../../Global/Handlers");
const { Mention } = require("./Custom");

module.exports = {
    Name: Events.MessageCreate,
    System: true,

    execute: async (client, message) => {

        if (message.content.includes(`${client.user.id}`)) {
            await Mention.run(client, message)
        }

        if (client.Vante.Commands) {
            return await MessageCommandsHandler(client, message);
        };
    }
};
