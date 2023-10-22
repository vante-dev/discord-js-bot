module.exports = async (member, messageId, addDuration, newPrize, newWinnerCount) => {
    if (!messageId) return member.guild.translate("giveaway:NO_MESSAGE_ID");

    // Search with messageId
    const giveaway = member.client.giveawaysManager.giveaways.find(
      (g) => g.messageId === messageId && g.guildId === member.guild.id
    );
  
    // If no giveaway was found
    if (!giveaway) return member.guild.translate("giveaway:GIVEAWAY_NOT_FOUND");
  
    try {
      await member.client.giveawaysManager.edit(messageId, {
        addTime: addDuration || 0,
        newPrize: newPrize || giveaway.prize,
        newWinnerCount: newWinnerCount || giveaway.winnerCount,
      });
  
      return member.guild.translate("giveaway:GIVEAWAY_UPDATED");
    } catch (error) {
      member.client.logger.error("Giveaway Edit", {
        error: error,
        guild: member.guild.name,
        member: member.displayName,
      });
      return member.guild.translate("giveaway:GIVEAWAY_ERROR7", { MESSAGE: error.message})
    }
  };