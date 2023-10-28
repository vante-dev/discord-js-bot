const { Events } = require("discord.js");
const { Command: { ContextCommandsHandler, SlashCommandsHandler } } = require("../../../Global/Handlers");
const { Button, Menu } = require("./Custom")

module.exports = {
    Name: Events.InteractionCreate,
    System: true,

    execute: async (client, interaction) => { 
        if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
            return await ContextCommandsHandler(client, interaction);
        }

        if (interaction.isButton()) return Button.run(client, interaction);
        if (interaction.isStringSelectMenu()) return Menu.run(client, interaction);

        if (interaction.isCommand()) {
            return await SlashCommandsHandler(client, interaction);
        }
    }
};