module.exports = async (member, messageId) => {
    if (!messageId) return member.guild.translate("giveaway:GIVEAWAY_ID");

    const giveaway = member.client.giveawaysManager.giveaways.find(
      (g) => g.messageId === messageId && g.guildId === member.guild.id
    );
  
    if (!giveaway) return member.guild.translate("giveaway:GIVEAWAY_NOT_FOUND", { ID: messageId });

    if (giveaway.pauseOptions.isPaused) return member.guild.translate("giveaway:ALREADY_PAUSED");
  
    try {
      await giveaway.pause();
      return member.guild.translate("giveaway:GIVEAWAY_PAUSE");
    } catch (error) {
      member.client.logger.error("Giveaway Pause", {
        guild: member.guild,
        error: error,
        client: member.client
      });
      return member.guild.translate("giveaway:GIVEAWAY_ERROR2", { MESSAGE: error.message });
    }
  };