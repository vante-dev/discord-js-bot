const { EmbedBuilder, DMChannel, TextChannel, VoiceChannel, PermissionsBitField: { Flags } } = require('discord.js');

module.exports = Object.defineProperties(DMChannel.prototype, {
    error: {
		value: function(key, args, returnValue) {
			try {
				const embed = new EmbedBuilder()
					.setColor(15158332)
					.setDescription(`${this.client.translate(key, args, require('@root/System').Client.Language) ?? key}`);
				return returnValue ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},

    success: {
		value: function(key, args, returnValue) {
			try {
				const embed = new EmbedBuilder()
					.setColor(3066993)
					.setDescription(`${this.client.translate(key, args, require('@root/System').Client.Language) ?? key}`);
				return returnValue ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},
});

const oriSend = TextChannel.prototype.send;
TextChannel.prototype.send = function(...args) {
	const send = oriSend.bind(this);
	if (!this.permissionsFor(this.client.user).has(Flags.SendMessages)) return;
	if (!this.permissionsFor(this.client.user).has(Flags.EmbedLinks)) {
		return send(this.client.translate('misc:MISSING_PERMISSION', { PERMISSIONS: this.client.translate('permissions:EMBED_LINKS', {}, this.guild.settings.Language) }, this.guild.settings.Language));
	}

	try {
		return send(...args);
	} catch (err) {
		this.client.logger.error(err.message);
	}
};

module.exports = Object.defineProperties(TextChannel.prototype, {
	error: {
		value: function(key, args, isForEmbed) {
			try {
				const embed = new EmbedBuilder()
					.setColor(15158332)
					.setDescription(`${this.client.translate(key, args, this.guild.settings.Language) ?? key}`);

				if (isForEmbed) return embed;
				this.send({ embeds: [embed] }).then(m => m.timedDelete({ timeout: 5000 }));
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},
	success: {
		value: function(key, args, isForEmbed) {
			try {
				const embed = new EmbedBuilder()
					.setColor(3066993)
					.setDescription(`${this.client.translate(key, args, this.guild.settings.Language) ?? key}`);
				return isForEmbed ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},
});

module.exports = Object.defineProperties(VoiceChannel.prototype, {
	error: {
		value: function(key, args, returnValue) {
			try {
				const embed = new EmbedBuilder()
					.setColor(15158332)
					.setDescription(`${this.client.translate(key, args, this.guild.settings.Language) ?? key}`);
				return returnValue ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},
	success: {
		value: function(key, args, returnValue) {
			try {
				const embed = new EmbedBuilder()
					.setColor(3066993)
					.setDescription(`${this.client.translate(key, args, this.guild.settings.Language) ?? key}`);
				return returnValue ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},
});