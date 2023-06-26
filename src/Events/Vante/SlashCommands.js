const { Events } = require("discord.js"), { Commands: { Interaction } } = require("@handlers/vante");

module.exports = async (client, interaction) => {
    if (!interaction.guild) {
        return client.embed(interaction, interaction.guild.translate("misc:GUILD"))
    }

    if (interaction.isChatInputCommand()) {
        await Interaction(client, interaction);
    }
};
  
module.exports.config = {
    Event: Events.InteractionCreate, System: true,
};