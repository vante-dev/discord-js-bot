const { User } = require('discord.js');

module.exports = Object.defineProperties(User.prototype, {
	cmdBanned: {
		value: false,
		writable: true,
		enumerable: true,
	},
});