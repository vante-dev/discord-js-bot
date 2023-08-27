const { ApplicationCommandType: { Message, User, ChatInput } } = require("discord.js");

module.exports = {
    Name: "Banner",
    Description: "displays banner information about the user",
    Type: User,
    Cooldown: 10,
    Enabled: true,
    Ephemeral: true,

    async run(client, interaction) {
        const member = interaction.guild.members.cache.get(interaction.targetId);
        
        const embed = client.embed(interaction, { 
            title: interaction.guild.translate("context/banner:TITLE", { USER: member.user.username}), 
            image: await member.bannerURL({ size: 2048 }),
            footer: { text: interaction.guild.translate("context/banner:FOOTER", { USER: interaction.user.username }) },
        })

        await interaction.followUp({
            embeds: [embed],
        })
    },
};