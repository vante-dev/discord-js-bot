const { Message } = require('discord.js');

module.exports = Object.defineProperties(Message.prototype, {
	translate: {
		value: function(key, args) {
			const language = this.client.translations.get(this.guild?.settings.Language ?? this.client.Vante.Language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},

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
			});
            
		},
	},
});