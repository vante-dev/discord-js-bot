const { ApplicationCommandType: { Message, User, ChatInput } } = require("discord.js");

module.exports = {
    Name: "Banner",
    Description: "Displays banner information about the user",
    Type: User,
    Cooldown: 10,
    Enabled: true,
    Ephemeral: true,

    Permissions: {
        Client: [],
        User: [],
        Role: []
    },

    async run(client, interaction) {
        const member = interaction.guild.members.cache.get(interaction.targetId);
        
        const embed = client.embed(interaction, { 
            title: '@' + member.user.username,
            image: await member.bannerURL({ size: 2048 }),
            footer: { text: ' ' },
        })

        await interaction.followUp({
            embeds: [embed],
        })
    },
};