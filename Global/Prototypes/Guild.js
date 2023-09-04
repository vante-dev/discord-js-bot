const { Guild } = require('discord.js'), { GuildSchema } = require('../Database/Models'), { Logger: { debug } } = require('../Helpers');

module.exports = Object.defineProperties(Guild.prototype, {
	/**
	  * Fetches guild settings from the database or provides default values if not found.
	  * @returns {Promise<Object>} The guild settings object.
	  */
	fetchSettings: {
		value: async function () {
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
		value: async function (settings) {
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
		value: function (key, args) {
			const language = this.client.translations.get(this.settings.language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},


	/**
	  * Creates a new database entry for the guild.
	  *
	* @function
	  * @async
	  * @name createDB
	  * @memberof YourClassName
	  * @instance
	  * @throws {Error} If an error occurs while fetching settings.
	  * @returns {Promise<void>} A promise that resolves when the database entry is created.
	  */
	createDB: {
		value: async function () {
			try {
				await this.fetchSettings();
			} catch (err) {
				console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( @createDB ) has error: \n${err.message}.`)}`);
			}
		},
	},

	/**
	* Deletes the database entry for the guild.
	*
	* @function
	* @async
	* @name deleteDB
	* @memberof YourClassName
	* @instance
	* @returns {Promise<boolean>} A promise that resolves to `true` if the database entry is deleted successfully, otherwise `false`.
	*/
	deleteDB: {
		value: async function () {
			try {
				await GuildSchema.findOneAndRemove({ guildID: guild.id });
				return true;
			} catch (err) {
				return false;
			}
		},
	},

	/**
 * Finds and returns a role in the guild by its name or ID.
 *
 * @function
 * @memberof YourClassName
 * @param {string} content - The name or ID of the role to find.
 * @returns {Role|null} The found role or null if not found.
 */
	getRole: {
		value: function (content) {
			return this.roles.cache.find(r => r.name === content) || this.roles.cache.find(r => r.id === content);
		},
	},

	/**
	 * Finds and returns a channel in the guild by its name or ID.
	 *
	 * @function
	 * @memberof YourClassName
	 * @param {string} content - The name or ID of the channel to find.
	 * @returns {GuildChannel|null} The found channel or null if not found.
	 */
	getChannel: {
		value: function (content) {
			return this.channels.cache.find(c => c.name === content) || this.channels.cache.find(c => c.id === content);
		},
	},


	/**
	  * Retrieves statistics about the members in the guild.
	  *
	  * @async
	  * @function
	  * @name getMemberStats
	  * @memberof YourClassName
	  * @returns {Promise<Object>} An object containing member statistics.
	  * @throws {Error} If there is an issue while fetching members.
	  *
	  * @property {number} total - The total number of members in the guild.
	  * @property {number} members - The number of non-bot members in the guild.
	  * @property {number} bots - The number of bot members in the guild.
	  */
	getMemberStats: {
		value: async function () {
			const all = await this.members.fetch({ force: false, cache: false });
			const total = all.size;
			const bots = all.filter((mem) => mem.user.bot).size;
			const members = total - bots;

			return {
				total: total,
				members: members,
				bots: bots
			};
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