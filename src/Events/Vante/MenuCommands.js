const { Events } = require("discord.js");
const { Contexts: { Command } } = require("@handlers/vante");

module.exports = async (client, interaction) => {
    if (!interaction.guild) {
        return client.embed(interaction, interaction.guild.translate("misc:GUILD"))
    }

    if (interaction.isContextMenuCommand()) {
        const context = client.contextMenus.get(interaction.commandName);
        if (context) await Command(client, interaction, context);
        else return client.embed(interaction, interaction.guild.translate("misc:ERROR_CMD")).catch(() => {});
    }
};
  
module.exports.config = {
    Event: Events.InteractionCreate, System: true,
};