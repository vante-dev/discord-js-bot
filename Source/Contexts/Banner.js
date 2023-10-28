const { ApplicationCommandType: { Message, User, ChatInput } } = require('discord.js');

module.exports = {
    Name: 'Banner',
    Description: 'Get a users\'s banner.',
    Type: User,
    Cooldown: 10,
    Enabled: true,
    Ephemeral: true,

    Permissions: {
        Client: [],
        User: [],
        Role: []
    },

    async interactionRun(client, interaction) {
        const user = interaction.options.getUser('user');

        const avatar = await user.bannerURL({ format: 'png', dynamic: true, size: 2048 });

        interaction.followUp({ content: avatar, ephemeral: true });
    },
};