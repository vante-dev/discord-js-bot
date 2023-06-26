const { CommandInteraction } = require('discord.js');

module.exports = Object.defineProperties(CommandInteraction.prototype, {
    translate: {
		value: function(key, args) {
			const language = this.client.translations.get(this.guild?.settings.Language ?? require('@root/System').Client.Language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},
});