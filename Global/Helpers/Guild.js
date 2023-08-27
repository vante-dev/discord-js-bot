const { Guild, TextChannel, VoiceChannel, Message } = require("discord.js");

const ROLE_MENTION = /<?@?&?(\d{17,20})>?/;
const MEMBER_MENTION = /<?@?!?(\d{17,20})>?/;
const CHANNEL_MENTION = /<?#?(\d{17,20})>?/;

/**
 * Finds a role by name in the given guild.
 * @param {Guild} guild - The Discord guild.
 * @param {string} name - The name of the role.
 * @returns {Role|null} The found role, or null if not found.
 */
function getRoleByName(guild, name) {
    return guild.roles.cache.find((role) => role.name.toLowerCase() === name);
}

/**
 * Finds a channel by name in the given guild.
 * @param {Guild} guild - The Discord guild.
 * @param {string} name - The name of the channel.
 * @returns {Role|null} The found channel, or null if not found.
 */
function getChannelByName(guild, name) {
    return guild.channels.cache.find((channel) => channel.name.toLowerCase() === name);
}

/**
 * Gets channels in the guild that match the given query.
 * @param {Guild} guild - The Discord guild.
 * @param {string} query - The query to match against channel names.
 * @returns {Array} An array of matching channels.
 */
function getMatchingChannel(guild, query) {
    if (!guild || !query || typeof query !== "string") return;

    const patternMatch = query.match(CHANNEL_MENTION);
    if (patternMatch) {
      let id = patternMatch[1];
      let channel = guild.channels.cache.find((r) => r.id === id);
      if (channel) return [channel];
    }
  
    const exact = [];
    const startsWith = [];
    const includes = [];
    guild.channels.cache.forEach((ch) => {
      let lowerName = ch.name.toLowerCase();
      if (ch.name === query) exact.push(ch);
      if (lowerName.startsWith(query.toLowerCase())) startsWith.push(ch);
      if (lowerName.includes(query.toLowerCase())) includes.push(ch);
    });
  
    if (exact.length > 0) return exact;
    if (startsWith.length > 0) return startsWith;
    if (includes.length > 0) return includes;
    return [];
}

/**
 * Retrieves member statistics for the guild.
 * @param {Guild} guild - The Discord guild.
 * @returns {Promise<Array>} An array containing total members, bot count, and human member count.
 */
async function getMemberStats(guild) {
    const all = await guild.members.fetch({
        force: false,
        cache: false,
      });
      const total = all.size;
      const bots = all.filter((mem) => mem.user.bot).size;
      const members = total - bots;
      return [total, bots, members];
}

/**
 * Finds roles in the guild that match the given query.
 * @param {Guild} guild - The Discord guild.
 * @param {string} query - The query to match against role names.
 * @returns {Array} An array of matching roles.
 */
function findMatchingRoles(guild, query) {
    if (!guild || !query || typeof query !== "string") return;

    const patternMatch = query.match(ROLE_MENTION);
    if (patternMatch) {
      let id = patternMatch[1];
      let role = guild.roles.cache.find((r) => r.id === id);
      if (role) return [role];
    }
  
    const exact = [];
    const startsWith = [];
    const includes = [];
    guild.roles.cache.forEach((role) => {
      let lowerName = role.name.toLowerCase();
      if (role.name === query) exact.push(role);
      if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role);
      if (lowerName.includes(query.toLowerCase())) includes.push(role);
    });
    if (exact.length > 0) return exact;
    if (startsWith.length > 0) return startsWith;
    if (includes.length > 0) return includes;
    return [];
}

/**
 * Resolves a member from a message and a query.
 * @param {Message} message - The Discord message.
 * @param {string} query - The query to resolve the member.
 * @param {boolean} exact - Whether to perform an exact match.
 * @returns {Promise<Member|null>} A promise resolving to the resolved member, or null if not found.
 */
async function resolveMember(message, query, exact = false) {
    if (!message || !query || typeof query !== "string") return;
    const memberManager = message.guild.members.members;
  
    // Check if mentioned or ID is passed
    const patternMatch = query.match(MEMBER_MENTION);
    if (patternMatch) {
      let id = patternMatch[1];
  
      let mentioned = message.mentions.members.find((m) => m.id === id); // check if mentions contains the ID
      if (mentioned) return mentioned;
  
      let fetched = await memberManager.fetch({ user: id }).catch((ex) => {});
      if (fetched) return fetched;
    }
  
    // Fetch and cache members from API
    await memberManager.fetch({ query: query }).catch((ex) => {});
  
    // Check if exact tag is matched
    let matchingTags = memberManager.cache.filter((mem) => mem.user.tag === query);
    if (matchingTags.size === 1) return matchingTags.first();
  
    // Check for matching username
    if (!exact) {
      return memberManager.cache.find(
        (x) =>
          x.user.username === query ||
          x.user.username.toLowerCase().includes(query.toLowerCase()) ||
          x.displayName.toLowerCase().includes(query.toLowerCase())
      );
    }
}

module.exports = {
  getRoleByName,
  getChannelByName,
  getMatchingChannel,
  getMemberStats,
  findMatchingRoles,
  resolveMember,
};
