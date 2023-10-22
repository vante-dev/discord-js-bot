module.exports = async (member, messageId) => {
    if (!messageId) return member.guild.translate("giveaway:GIVEAWAY_ID");

    const giveaway = member.client.giveawaysManager.giveaways.find(
      (g) => g.messageId === messageId && g.guildId === member.guild.id
    );

    if (!giveaway) return member.guild.translate("giveaway:GIVEAWAY_NOT_FOUND");
  
    // Check if the giveaway is ended
    if (giveaway.ended) return member.guild.translate("giveaway:GIVEAWAY_END");
  
    try {
      await giveaway.end();
      return member.guild.translate("giveaway:GIVEAWAY_END2");
    } catch (error) {
      member.client.logger.error("Giveaway End", {
        guild: member.guild,
        error: error,
        client: member.client
      });
      return member.guild.translate("giveaway:GIVEAWAY_ERROR4", { MESSAGE: error.message });
    }
  };