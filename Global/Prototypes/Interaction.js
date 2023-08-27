const { BaseInteraction } = require('discord.js');

module.exports = Object.defineProperties(BaseInteraction.prototype, {
    /**
    * Translate a key using the specified language, or default to 'en-US'.
    * @param {string} key - The key to be translated.
    * @param {Object} [args] - Optional arguments to replace placeholders in the translation.
    * @returns {string} The translated message.
    */
	translate: {
		value: function(key, args) {
			const language = this.client.translations.get(this.guild?.settings.Language ?? 'en-US');
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},
});