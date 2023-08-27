const { Message } = require('discord.js');

module.exports = Object.defineProperties(Message.prototype, {
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

	/**
 	* Deletes a message after a specified delay, if the message is deletable.
 	*
 	* @param {number} delayInSeconds - The delay time in seconds before the deletion action is performed.
 	* @returns {Promise<null>} A promise that resolves to `null` after the deletion attempt (or if not deletable).
 	*/
	dlt: {
		value: async function(delayInSeconds) {
			return new Promise((resolve) => {
				setTimeout(() => {
				  resolve(this);
				}, delayInSeconds * 1000);
			  }).then((message) => {
				 {
				  return message.delete().catch(console.error);
				}
				return null;
			  });
		},
	},
});