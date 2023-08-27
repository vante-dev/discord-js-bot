const { ApplicationCommandType: { Message, User, ChatInput } } = require("discord.js");

module.exports = {
    Name: "Avatar",
    Description: "displays avatar information about the user",
    Type: User,
    Cooldown: 10,
    Enabled: true,
    Ephemeral: true,

    async run(client, interaction) {
        const user = interaction.guild.members.cache.get(interaction.targetId).user;

        const embed = client.embed(interaction, { 
            title: interaction.guild.translate("context/avatar:TITLE", { USER: user.username}), 
            image: user.displayAvatarURL({ extension: "png", size: 2048 }),
            footer: { text: interaction.guild.translate("context/avatar:FOOTER", { USER: interaction.user.username }) },
        })

        await interaction.followUp({
            embeds: [embed],
        })
    },
};