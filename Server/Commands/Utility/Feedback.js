const { 
    ApplicationCommandOptionType: { String },
    EmbedBuilder
} = require('discord.js'); 

module.exports = {
    Name: 'feedback',
    Aliases: ['suggestion'],
    Description: 'Share your thoughts about the bot',
    Usage: 'feedback <text>',
    Category: 'Utility',
    Cooldown: 60,
    
    Permissions: {
        User: [],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: true,
        Ephemeral: true,
        
        Options: [
            {
                name: "text",
                description: "explain the feedback",
                type: String,
                required: true
            }
        ],
    },
    
    /**
     * Function to execute when the module is loaded.
     * @param {Client} client - The Discord bot client instance.
     * @returns {Promise<void>} Returns a promise that resolves when the module is loaded.
     * @async
     */
    onLoad: async (client) => {},

    /**
     * Function to execute when the command is triggered via a message.
     * @param {Client} client - The Discord bot client instance.
     * @param {Message} message - The Discord message object triggering the command.
     * @param {string[]} args - An array of arguments provided with the command.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    messageRun: async (client, message, args, settings) => {
        
        var id = Math.floor(Math.random() * 10000);

        if (args.length < 1) return client.systemEmbed(message, message.translate("utility/feedback:REPORT"));

        if (args.length < 3) return client.systemEmbed(message, message.translate("utility/feedback:MORE"));

        let invite = await message.channel.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => {});

        let report = args.join(' ').split('').join('')

        const embed = new EmbedBuilder()
        .setTitle('New Feedback')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFields(
            { name: 'User', value: `${message.author}`, inline: true },
            { name: 'User Name', value: `@${message.author.username}`, inline: true },
            { name: 'User ID', value: `${message.author.id}`, inline: true },
            { name: 'Feedback', value: `${report}`, inline: false },
            { name: 'Server', value: `[${message.guild.name}](${invite ||'none '})`, inline: true },
            { name: 'Feedback ID', value: `#${id}`, inline: true }
        )

        const embed2 = new EmbedBuilder()
        .setTitle('Feedback')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `ID: #${id}`})
        .setFields(
            { name: 'User', value: `${message.author}`, inline: true },
            { name: 'User Name', value: `@${message.author.username}`, inline: true },
            { name: 'User ID', value: `${message.author.id}`, inline: true },
            { name: 'Feedback', value: `${report}`, inline: false },
        )

        const logChannel = client.getWebhook('Feedbacks');

        logChannel.send({
            username: client.user.username,
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed]
        });

        message.author.send({ embeds: [embed2] }).catch(()=>{})
        message.delete().catch(()=>{})
    },

    /**
     * Function to execute when the command is triggered via a slash command interaction.
     * @param {Client} client - The Discord bot client instance.
     * @param {CommandInteraction} interaction - The slash command interaction object.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    interactionRun: async (client, interaction, settings) => {

        const report = interaction.options.getString("text");

        let invite = await interaction.channel.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => {});

        let id = Math.floor(Math.random() * 10000);

        const embed = new EmbedBuilder()
        .setTitle('New Feedback')
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFields(
            { name: 'User', value: `${interaction.user}`, inline: true },
            { name: 'User Name', value: `@${interaction.user.username}`, inline: true },
            { name: 'User ID', value: `${interaction.user.id}`, inline: true },
            { name: 'Feedback', value: `${report}`, inline: false },
            { name: 'Server', value: `[${interaction.guild.name}](${invite ||'none '})`, inline: true },
            { name: 'Feedback ID', value: `#${id}`, inline: true }
        )

        const embed2 = new EmbedBuilder()
        .setTitle('Feedback')
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `ID: #${id}`})
        .setFields(
            { name: 'User', value: `${interaction.user}`, inline: true },
            { name: 'User Name', value: `@${interaction.user.username}`, inline: true },
            { name: 'User ID', value: `${interaction.user.id}`, inline: true },
            { name: 'Feedback', value: `${report}`, inline: false },
        )

        const logChannel = client.getWebhook('Feedbacks');

        logChannel.send({
            username: client.user.username,
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed]
        });

        interaction.user.send({ embeds: [embed2] }).catch(async ()=>{
            return await interaction.followUp({
                embeds: [embed2]
            })
        })

        await interaction.followUp({
            content: interaction.translate("utility/feedback:SUCCESS")
        })
    },
};