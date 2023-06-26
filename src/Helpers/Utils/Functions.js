const { EmbedBuilder } = require("discord.js"), cooldownCache = new Map(), Logger = require("@utils/Logger");

module.exports.toSmallNum = async (count, digits) => {
    let result = '';
	if (!digits) digits = count.toString().length;
	for (let i = 0; i < digits; i++) {
		let digit = count % 10;
		count = Math.trunc(count / 10);
		result = numbers[digit] + result;
	}
	return result;
};

module.exports.toFancyNum = async (num) => {
    let parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};

module.exports.toShortNum = async (num) => {
    if (num >= 1000000) return Math.trunc(num / 1000000) + 'M';
	else if (num >= 1000) return Math.trunc(num / 1000) + 'K';
	else return num;
};

module.exports.toDiscordTimestamp = async (date, flag = 'R') => {
    if (typeof date === 'number' || isInt(date)) {
		return `<t:${Math.trunc(+date / 1000)}:${flag}>`;
	}
	return `<t:${Math.trunc(date.valueOf() / 1000)}:${flag}>`;
};

module.exports.applyCooldown = async (memberId, cmd) => {
	const key = cmd.Name + "|" + memberId;
    cooldownCache.set(key, Date.now());
};

module.exports.getRemainingCooldown = async (memberId, cmd) => {
    const key = cmd.Name + "|" + memberId;
    if (cooldownCache.has(key)) {
      const remaining = (Date.now() - cooldownCache.get(key)) * 0.001;
      if (remaining > cmd.Cooldown) {
        cooldownCache.delete(key);
        return 0;
      }
      return cmd.Cooldown - remaining;
    }
    return 0;
};

module.exports.checkForUpdates = async ({ GitHub = "https://github.com/vantexsrd/discord-js-bot/" }) => {
    const response = await getJson("https://api.github.com/repos/vantexsrd/discord-js-bot/releases/latest");
    if (!response.success) return error("VersionCheck: Failed to check for bot updates");
    if (response.data) {
        if (require("@root/package.json").version.replace(/[^0-9]/g, "") >= response.data.tag_name.replace(/[^0-9]/g, "")) {
            Logger.debug("VersionCheck: Your discord bot is up to date");
        } else {
            Logger.error(`VersionCheck: ${response.data.tag_name} update is available`);
            Logger.error("download: https://github.com/vantexsrd/discord-js-bot/releases/latest");
        }
    }
};