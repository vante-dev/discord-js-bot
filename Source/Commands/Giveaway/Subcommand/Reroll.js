module.exports = async (member, messageId) => {
    if (!messageId) return member.guild.translate("giveaway:GIVEAWAY_ID")
  
    // Search with messageId
    const giveaway = member.client.giveawaysManager.giveaways.find(
      (g) => g.messageId === messageId && g.guildId === member.guild.id
    );
  
    // If no giveaway was found
    if (!giveaway) return member.guild.translate("giveaway:GIVEAWAY_NOT_FOUND", { ID: messageId });
  
    // Check if the giveaway is ended
    if (!giveaway.ended) return member.guild.translate("giveaway:GIVEAWAY_REROLL");
  
    try {
      await giveaway.reroll();
      return member.guild.translate("giveaway:GIVEAWAY_REROLL2")
    } catch (error) {
      member.client.logger.error("Giveaway Reroll", {
        guild: member.guild,
        error: error,
        client: member.client
      });
      return member.guild.translate("giveaway:GIVEAWAY_ERROR5", { MESSAGE: error.message });
    }
  };