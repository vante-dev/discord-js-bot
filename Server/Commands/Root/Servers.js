const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    Name: 'servers',
    Aliases: [],
    Description: 'Displays a list of client joined servers.',
    Usage: 'servers',
    Category: 'Root',
    Cooldown: 0,
    
    Permissions: {
        User: [],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: false,
        Ephemeral: false,
        
        Options: [],
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
        let i0 = 0, i1 = 10, page = 1;

        let description = `\n` + client.guilds.cache
        .sort((a, b) => b.memberCount - a.memberCount)
        .map(r => r)
        .map((r, i) => `\`\`\`ansi\n[2;34m${r.name}\nID: ${r.id}\nMembers: ${r.members.cache.size}\nHumans: ${r.members.cache.filter(member => !member.user.bot).size}\nBots: ${r.members.cache.filter(member => member.user.bot).size}[0m\n\`\`\``)
        .slice(0, 10)
        .join("\n");

        let embed = new EmbedBuilder()
        .setTitle(`Total Servers - ${client.guilds.cache.size}`)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setFooter({ text: `Page - ${page}/${Math.ceil(client.guilds.cache.size / 10)}` })
        .setDescription(description);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("back").setLabel("⬅").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("stop").setLabel("⏹️").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("next").setLabel("➡").setStyle(ButtonStyle.Secondary)
        );

        let msg = await message.channel.send({ embeds: [embed], components: [row], collector: true })

        var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter })

        collector.on("collect", async (button) => {
            if (button.customId === "back") {
                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                if (i0 + 1 < 0) {
                    return msg.delete();
                }

                if (!i0 || !i1) {
                    return msg.delete();
                }

                description = `Total Servers - ${client.guilds.cache.size}\n\n` + client.guilds.cache
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(r => r)
                .map((r, i) => `\`\`\`ansi\n[2;34m${r.name}\nID: ${r.id}\nMembers: ${r.members.cache.size}\nHumans: ${r.members.cache.filter(member => !member.user.bot).size}\nBots: ${r.members.cache.filter(member => member.user.bot).size}[0m\n\`\`\``)
                .slice(i0, i1)
                .join("\n");

                embed.setFooter({ text: `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}` });
                embed.setDescription(description);

                msg.edit({ embeds: [ embed ]});
            }

            if (button.customId === "next") {
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                if (i1 > client.guilds.cache.size + 10) {
                    return msg.delete();
                }

                if (!i0 || !i1) {
                    return msg.delete();
                }

                description = `Total Servers - ${client.guilds.cache.size}\n\n` + client.guilds.cache
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(r => r)
                .map((r, i) => `\`\`\`ansi\n[2;34m${r.name}\nID: ${r.id}\nMembers: ${r.members.cache.size}\nHumans: ${r.members.cache.filter(member => !member.user.bot).size}\nBots: ${r.members.cache.filter(member => member.user.bot).size}[0m\n\`\`\``)
                .slice(i0, i1)
                .join("\n");

                embed.setFooter({ text: `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}` });
                embed.setDescription(description);

                msg.edit({ embeds: [ embed ]});
            }

            if (button.customId === "stop") {
                return msg.delete();
            } 
        });
    },

    /**
     * Function to execute when the command is triggered via a slash command interaction.
     * @param {Client} client - The Discord bot client instance.
     * @param {CommandInteraction} interaction - The slash command interaction object.
     * @returns {Promise<void>} Returns a promise that resolves after command execution.
     * @async
     */
    interactionRun: async (client, interaction, settings) => {},
};