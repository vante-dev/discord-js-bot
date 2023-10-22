const { ChannelType } = require("discord.js");

module.exports = async (member, giveawayChannel, duration, prize, winners, host, allowedRoles = []) => {
  try {
    if (!host) host = member.user;

    if (!giveawayChannel.type === ChannelType.GuildText) {
      return member.guild.translate("giveaway:TEXT_CHANNEL");
    }
    const options = {
      duration: duration,
      prize,
      winnerCount: winners,
      hostedBy: host,
      messages: {
        giveaway: member.guild.translate("giveaway:GIVEAWAY", { EMOJI: member.client.emoji.tada }),
        giveawayEnded: member.guild.translate("giveaway:GIVEAWAY_ENDED", { EMOJI: member.client.emoji.tada }),
        giveawayEndedButton: member.guild.translate("giveaway:GIVEAWAY_BUTTON", { EMOJI: member.client.emoji.tada }),
        title: '{this.prize}',
        inviteToParticipate: member.guild.translate("giveaway:GIVEAWAY_PARTICIPATE", { EMOJI: member.client.emoji.tada }),
        winMessage: member.guild.translate("giveaway:GIVEAWAY_MESSAGE", { EMOJI: member.client.emoji.tada }),
        drawing: member.guild.translate("giveaway:GIVEAWAY_DRAWNING", { EMOJI: member.client.emoji.tada }),
        dropMessage: member.guild.translate("giveaway:GIVEAWAY_DROP", { EMOJI: member.client.emoji.tada }),
        embedFooter: member.guild.translate("giveaway:GIVEAWAY_FOOTER", { EMOJI: member.client.emoji.tada }),
        noWinner: member.guild.translate("giveaway:GIVEAWAY_CANCELLED", { EMOJI: member.client.emoji.tada }),
        winners: member.guild.translate("giveaway:GIVEAWAY_WINNERS", { EMOJI: member.client.emoji.tada }),
        endedAt: member.guild.translate("giveaway:GIVEAWAY_ENDEDAT", { EMOJI: member.client.emoji.tada }),
        hostedBy: member.guild.translate("giveaway:GIVEAWAY_HOSTER", { EMOJI: member.client.emoji.tada }),
        participants: member.guild.translate("giveaway:GIVEAWAY_PARTICIPANTS", { EMOJI: member.client.emoji.tada }),
      },
    };

    if (allowedRoles.length > 0) {
      options.exemptMembers = (member) => !member.roles.cache.find((role) => allowedRoles.includes(role.id));
    }

    await member.client.giveawaysManager.start(giveawayChannel, options);
    return await member.guild.translate("giveaway:GIVEAWAY_STARTED", { CHANNEL: giveawayChannel });
  } catch (error) {
    member.client.logger.error("Giveaway Start", {
        guild: member.guild,
        client: member.client,
        error: error,
    });
    return member.guild.translate("giveaway:GIVEAWAY_ERROR", { ERROR: error.message });
  }
};