const {
    ChannelType,
    ButtonBuilder,
    ActionRowBuilder,
    ComponentType,
    TextInputStyle,
    TextInputBuilder,
    ModalBuilder,
    ButtonStyle,
    ApplicationCommandOptionType,
    PermissionsBitField: { Flags },
} = require("discord.js");

const ems = require("enhanced-ms");

const start = require("./Subcommand/Start");
const pause = require("./Subcommand/Pause");
const resume = require("./Subcommand/Resume");
const end = require("./Subcommand/End");
const reroll = require("./Subcommand/Reroll");
const list = require("./Subcommand/List");
const edit = require("./Subcommand/Edit");

module.exports = {
    Name: 'giveaway',
    Aliases: [],
    Description: 'giveaway commands',
    Usage: '',
    Category: 'Giveaway',
    Cooldown: 0,

    Permissions: {
        User: [Flags.Administrator],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: false,
        Slash: true,
        Ephemeral: true,
        Options: [
            {
                name: "start",
                description: "start a giveaway",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "channel",
                        description: "the channel to start the giveaway in",
                        type: ApplicationCommandOptionType.Channel,
                        channelTypes: [ChannelType.GuildText],
                        required: true,
                    },
                ],
            },
            {
                name: "pause",
                description: "pause a giveaway",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "message_id",
                        description: "the message id of the giveaway",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "resume",
                description: "resume a paused giveaway",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "message_id",
                        description: "the message id of the giveaway",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "end",
                description: "end a giveaway",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "message_id",
                        description: "the message id of the giveaway",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "reroll",
                description: "reroll a giveaway",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "message_id",
                        description: "the message id of the giveaway",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "list",
                description: "list all giveaways",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "edit",
                description: "edit a giveaway",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "message_id",
                        description: "the message id of the giveaway",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "add_duration",
                        description: "the number of minutes to add to the giveaway duration",
                        type: ApplicationCommandOptionType.Integer,
                        required: false,
                    },
                    {
                        name: "new_prize",
                        description: "the new prize",
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    },
                    {
                        name: "new_winners",
                        description: "the new number of winners",
                        type: ApplicationCommandOptionType.Integer,
                        required: false,
                    },
                ],
            },

        ],
    },

    messageRun: async (client, message, args, settings) => { },

    interactionRun: async (client, interaction, settings) => {
        const sub = interaction.options.getSubcommand();
        let response;

        if (sub === "start") {
            const channel = interaction.options.getChannel("channel");
            return await runModalSetup(interaction, interaction, channel);
        }

        else if (sub === "pause") {
            const messageId = interaction.options.getString("message_id");
            response = await pause(interaction.member, messageId);
        }

        else if (sub === "resume") {
            const messageId = interaction.options.getString("message_id");
            response = await resume(interaction.member, messageId);
        }

        else if (sub === "end") {
            const messageId = interaction.options.getString("message_id");
            response = await end(interaction.member, messageId);
        }

        else if (sub === "reroll") {
            const messageId = interaction.options.getString("message_id");
            response = await reroll(interaction.member, messageId);
        }

        else if (sub === "list") {
            response = await list(interaction.member);
        }

        else if (sub === "edit") {
            const messageId = interaction.options.getString("message_id");
            const addDur = interaction.options.getInteger("add_duration");
            const addDurationMs = addDur ? ems(addDur) : null;
            if (!addDurationMs) {
                return interaction.followUp("Not a valid duration");
            }
            const newPrize = interaction.options.getString("new_prize");
            const newWinnerCount = interaction.options.getInteger("new_winners");
            response = await edit(interaction.member, messageId, addDurationMs, newPrize, newWinnerCount);
        }

        else response = "Invalid subcommand";

        await interaction.followUp(response);
    },
};

async function runModalSetup(interaction, { member, channel, guild }, targetCh) {
    if (!targetCh) return channel.send(guild.translate("giveaway:NO_CHANNEL"));

    const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("giveaway_btnSetup").setLabel(guild.translate("giveaway:SETUP")).setStyle(ButtonStyle.Primary)
    );

    const sentMsg = await interaction.followUp({
        content: guild.translate("giveaway:BUTTON"),
        components: [buttonRow],
    });

    if (!sentMsg) return;

    const btnInteraction = await channel
        .awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: (i) => i.customId === "giveaway_btnSetup" && i.member.id === member.id && i.message.id === sentMsg.id,
            time: 20000,
        })
        .catch((ex) => { });

    if (!btnInteraction) return sentMsg.edit({ content: guild.translate("giveaway:INTERACTION"), components: [] });

    await btnInteraction.showModal(
        new ModalBuilder({
            customId: "giveaway-modalSetup",
            title: guild.translate("giveaway:SETUP2"),
            components: [
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("duration")
                        .setLabel(guild.translate("giveaway:DURATION"))
                        .setPlaceholder("1h / 1d / 1w")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("prize")
                        .setLabel(guild.translate("giveaway:PRIZE"))
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("winners")
                        .setLabel(guild.translate("giveaway:WINNERS"))
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("roles")
                        .setLabel(guild.translate("giveaway:ROLES"))
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("host")
                        .setLabel(guild.translate("giveaway:HOST"))
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),
            ],
        })
    );

    const modal = await btnInteraction
        .awaitModalSubmit({
            time: 1 * 60 * 1000,
            filter: (m) => m.customId === "giveaway-modalSetup" && m.member.id === member.id && m.message.id === sentMsg.id,
        })
        .catch((ex) => { });

    if (!modal) return sentMsg.edit({ content: guild.translate("giveaway:MODAL"), components: [] });

    await modal.reply(guild.translate("giveaway:LOADING"));

    const duration = ems(modal.fields.getTextInputValue("duration"));
    if (isNaN(duration)) return modal.editReply(guild.translate("giveaway:DURATION2"));

    const prize = modal.fields.getTextInputValue("prize");

    const winners = parseInt(modal.fields.getTextInputValue("winners"));
    if (isNaN(winners)) return modal.editReply(guild.translate("giveaway:WINNERS2"));

    const allowedRoles =
        modal.fields
            .getTextInputValue("roles")
            ?.split(",")
            ?.filter((roleId) => guild.roles.cache.get(roleId.trim())) || [];

    const hostId = modal.fields.getTextInputValue("host");
    let host = null;
    if (hostId) {
        try {
            host = await guild.client.users.fetch(hostId);
        } catch (ex) {
            return modal.editReply(guild.translate("giveaway:HOST2"));
        }
    }

    const response = await start(member, targetCh, duration, prize, winners, host, allowedRoles);
    await modal.editReply(response).then(message => {
        setTimeout(() => { message.delete() }, 5 * 1000);
    });
}