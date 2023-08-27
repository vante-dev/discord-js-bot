const { Guild } = require('discord.js'),  { GuildSchema } = require('../Database/Models'), { Logger: { debug } } = require('../Helpers');

module.exports = Object.defineProperties(Guild.prototype, {
	/**
 	* Fetches guild settings from the database or provides default values if not found.
 	* @returns {Promise<Object>} The guild settings object.
 	*/
    fetchSettings: {
		value: async function() {
			return this.settings = await GuildSchema.findOne({ guildID: this.id }) ?? {
				guildID: this.id,
				guildName: this.name,
				prefix: this.client.system.Client.Prefix,
				language: this.client.system.Client.Language
            };
		},
	},

	/**
 	* Update guild settings in the database or create a new schema if necessary.
 	* @param {Object} settings - The settings object to update.
 	* @returns {Promise<Object>} The updated guild settings object.
 	*/
	updateGuild: {
		value: async function(settings) {
			debug(`Guild: [${this.id}] updated settings: ${Object.keys(settings)}`);
			// Check if the DB is getting updated or creating new schema
			if (this.settings.guildID) {
				await GuildSchema.findOneAndUpdate({ guildID: this.id }, settings);
			} else {
				const newGuild = new GuildSchema(Object.assign({ guildID: this.id, guildName: this.name }, settings));
				await newGuild.save();
			}
			return this.fetchSettings();
		},
	},

	/**
 	* Translate a key using the guild's language settings.
 	* @param {string} key - The key to be translated.
 	* @param {Array} [args] - Optional arguments to replace placeholders in the translation.
 	* @returns {string} The translated message.
 	*/
	translate: {
		value: function(key, args) {
			const language = this.client.translations.get(this.settings.language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},

	/**
 	* Object representing guild settings.
	* @type {GuildSettings}
 	*/
	settings: {
		value: {},
		writable: true,
	},
});