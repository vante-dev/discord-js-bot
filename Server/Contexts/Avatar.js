const { ApplicationCommandType: { Message, User, ChatInput } } = require("discord.js");

module.exports = {
    Name: "Avatar",
    Description: "Displays avatar information about the user",
    Type: User,
    Cooldown: 20,
    Enabled: true,
    Ephemeral: true,

    Permissions: {
        Client: [],
        User: [],
        Role: []
    },

    async run(client, interaction) {
        const user = interaction.guild.members.cache.get(interaction.targetId).user;

        const embed = client.embed(interaction, { 
            image: user.displayAvatarURL({ extension: "png", size: 2048 }),
            author: { name: '@' + user.username, icon: user.displayAvatarURL({ extension: "png", size: 2048 }) },
            footer: { text: ' ' }
        })

        await interaction.followUp({
            embeds: [embed],
        })
    },
};