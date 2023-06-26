const { Guild } = require('discord.js'), Settings = require("@schemas/Guild"), { Logger } = require("@utils/vante"), Vante = require("@root/System")

module.exports = Object.defineProperties(Guild.prototype, {
    fetchSettings: {
		value: async function() {
			this.settings = await Settings.findOne({ guildID: this.id }) ?? {
				Language: Vante.Client.Language,
        		Prefix: [ Vante.Client.Prefix ]
			};
			return this.settings;
		},
	},

    updateGuild: {
		value: async function(settings) {
			Logger.debug(`Guild: [${this.id}] updated settings: ${Object.keys(settings)}`);
			if (this.settings.guildID) {
				await Settings.findOneAndUpdate({ guildID: this.id }, settings);
			} else {
				const newGuild = new Settings(Object.assign({ guildID: this.id, guildName: this.name }, settings));
				await newGuild.save();
			}
			return this.fetchSettings();
		},
	},

    translate: {
		value: function(key, args) {
			const language = this.client.translations.get(this.settings.Language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},

    settings: {
		value: {},
		writable: true,
	},

    premium: {
		value: false,
		writable: true,
	},
});