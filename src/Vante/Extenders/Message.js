const { Message } = require('discord.js'), { findBestMatch } = require('string-similarity');

module.exports = Object.defineProperties(Message.prototype, {
    args: {
		value: [],
		writable: true,
	},

    getArgs: {
		value: function() {
			const args = this.content.split(/ +/);
			args.shift();
			if (this.content.startsWith(`<@!${this.client.user.id}>`)) args.shift();

			this.args = args;
			return args;
		},
	},

    getMember: {
		value: async function(fallback = true) {
			const users = [];

			for (let i = 0; i < this.args.length; i++) {
				if ([...this.mentions.users.values()][i] || await this.client.users.fetch(this.args[i]).catch(() => {})) {
					users.push([...this.mentions.users.values()][i] || await this.client.users.fetch(this.args[i]).catch(() => {}));
				}
			}
			if (this.args[0]) {
				const members = [], indexes = [];
				if (this.guild) {
					await this.guild.members.fetch();

					this.guild.members.cache.forEach(member => {
						members.push(member.user.username);
						indexes.push(member.id);
					});
				} else {
					members.push(this.author.username, this.client.user.username);
					indexes.push(this.author.id, this.client.user.id);
				}

				const match = findBestMatch(this.args.join(' '), members);
				if (match.bestMatch.rating >= 0.1) {
					const username = match.bestMatch.target,
						member = this.client.users.cache.get(indexes[members.indexOf(username)]);
					users.push(member);
				}
			}

			if (fallback) users.push(this.author);

			let items;
			if (this.guild) {
				items = users.map(user => this.guild.members.cache.get(user.id)).filter(member => member !== undefined);
			} else {
				items = users.map(user => Object.assign({ id: user.id }, { user: user }));
			}

			return items;
		},
	},

    getChannel: {
		value: function() {
			const channels = [];
			for (let i = 0; i < this.args.length; i++) {
				if ([...this.mentions.channels.values()][i] || this.guild.channels.cache.get(this.args[i])) {
					channels.push([...this.mentions.channels.values()][i] || this.guild.channels.cache.get(this.args[i]));
				}
			}
			channels.push(this.channel);
			return channels;
		},
	},

    getRole: {
		value: function() {
			const roles = [];
			for (let i = 0; i < this.args.length; i++) {
				if ([...this.mentions.roles.values()][i] || this.guild.roles.cache.get(this.args[i])) {
					roles.push([...this.mentions.roles.values()][i] || this.guild.roles.cache.get(this.args[i]));
				}
			}

			if (this.args[0]) {
				const roleList = [];
				this.guild.roles.cache.forEach(r => {
					roleList.push(r.name);
				});
				if (roleList.length != this.args.length) {
					const match = findBestMatch(this.args.join(' '), roleList);
					if (match.bestMatch.rating != 0) {
						const username = match.bestMatch.target,
							role = this.guild.roles.cache.find(r => r.name == username);
						roles.push(role);
					}
				}
			}
			return roles;
		},
	},

    getImage: {
		value: async function() {
			const fileTypes = ['png', 'jpeg', 'tiff', 'jpg', 'webp'];
			const file = [];
			if (this.attachments.size > 0) {
				const url = this.attachments.first().url;
				for (const type of fileTypes) {
					if (url.toLowerCase().indexOf(type) !== -1) file.push(url);
				}

				if (file.length === 0) return this.channel.error('misc:INVALID_FILE');
			}

			for (const value of this.args) {
				const patt = /https?:\/\/(?:(?:canary|ptb|www)\.)?discord(?:app)?\.com\/channels\/(?:@me|(?<g>\d+))\/(?<c>\d+)\/(?<m>\d+)/g;
				if (patt.test(value)) {
					const stuff = value.split('/');
					const message = await this.client.guilds.cache.get(stuff[4])?.channels.cache.get(stuff[5])?.messages.fetch(stuff[6]);
					if (message && message.attachments.size >= 1) {
						const url = message.attachments.first().url;
						for (const type of fileTypes) {
							if (url.indexOf(type) !== -1) file.push(url);
						}
					}
				}
			}

			if (this.type == 'REPLY') {
				const message = await this.channel.messages.fetch(this.reference.messageId);
				const url = message.attachments.first().url;
				for (const type of fileTypes) {
					if (url.indexOf(type) !== -1) file.push(url);
				}
			}

			file.push(...(await this.getMember()).map(member => member.user.displayAvatarURL({ format: 'png', size: 1024 })));
			return file;
		},
	},

    translate: {
		value: function(key, args) {
			const language = this.client.translations.get(this.guild?.settings.Language ?? require('@root/System').Client.Language);
			if (!language) return 'Invalid language set in data.';
			return language(key, args);
		},
	},

    Delete: {
		value: function(obj) {
			setTimeout(() => {
				this.delete();
			}, obj.timeout * 1000 || 3000);
		},
	},
});