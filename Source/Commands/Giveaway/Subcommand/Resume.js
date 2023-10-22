module.exports = async (member, messageId) => {
    if (!messageId) return member.guild.translate("giveaway:GIVEAWAY_ID");

    const giveaway = member.client.giveawaysManager.giveaways.find(
      (g) => g.messageId === messageId && g.guildId === member.guild.id
    );

    if (!giveaway) return member.guild.translate("giveaway:GIVEAWAY_NOT_FOUND", { ID: messageId });
  
    if (!giveaway.pauseOptions.isPaused) return member.guild.translate("giveaway:GIVEAWAY_NOT_PUASED");
  
    try {
      await giveaway.unpause();
      return member.guild.translate("giveaway:GIVEAWAY_RESUMED");
    } catch (error) {
      member.client.logger.error("Giveaway Resume", {
        guild: member.guild,
        error: error,
        client: member.client
      });
      return member.guild.translate("giveaway:GIVEAWAY_ERROR3", { MESSAGE: error.message });
    }
  };