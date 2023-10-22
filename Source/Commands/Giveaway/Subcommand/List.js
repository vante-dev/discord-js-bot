module.exports = async (member) => {
  // Search with all giveaways
  const giveaways = member.client.giveawaysManager.giveaways.filter(
    (g) => g.guildId === member.guild.id && g.ended === false
  );

  if (giveaways.length === 0) {
    return member.guild.translate("giveaway:GUILD_GIVEAWAYS");
  }

  const description = giveaways.map((g, i) => `${i + 1}. ${g.prize} - <#${g.channelId}>`).join("\n");

  try {
    return { embeds: [{ description }] };
  } catch (error) {
    member.client.logger.error("Giveaway List", {
        guild: member.guild,
        error: error,
        client: member.client
    });
    return member.guild.translate("giveaway:GIVEAWAY_ERROR6", { MESSAGE: error.message });
  }
};