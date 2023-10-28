const { Guild } = require('discord.js');
const GuildSchema = require('../../Settings/Models/GuildSchema');


module.exports = Object.defineProperties(Guild.prototype, {
	fetchSettings: {
		value: async function () {
			return this.settings = await this.client.database.find('Guild', { guildID: this.id, guildName: this.name });
		},
	},

	updateGuild: {
		value: async function (update) {
			if(this.client.Vante.Debugger) this.client.logger.debug(`Guild: [${this.id}] updated settings`);
			await this.client.database.update('Guild', { guildID: this.id }, update);
			return this.fetchSettings();
		},
	},

	translate: {
		value: function (key, args) {
			const language = this.client.translations.get(this.settings.Language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},

	createDB: {
		value: async function () {
			try {
				await this.fetchSettings();
			} catch (err) {
				console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`( @createDB ) has error: \n${err.message}.`)}`);
			}
		},
	},

	deleteDB: {
		value: async function () {
			try {
				await this.client.database.delete('Guild', { guildID: this.id });
				return true;
			} catch (err) {
				return false;
			}
		},
	},

	getRole: {
		value: function (content) {
			return this.roles.cache.find(r => r.name === content) || this.roles.cache.find(r => r.id === content);
		},
	},

	getChannel: {
		value: function (content) {
			return this.channels.cache.find(c => c.name === content) || this.channels.cache.find(c => c.id === content);
		},
	},

	getMemberStats: {
		value: async function (gu) {
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

	settings: {
		value: {},
		writable: true,
	},
});