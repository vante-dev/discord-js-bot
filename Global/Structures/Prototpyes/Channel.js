const { EmbedBuilder, TextChannel, VoiceChannel, PermissionsBitField: { Flags } } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
 
module.exports = Object.defineProperties(TextChannel.prototype, {
	error: {
		/**
        * A method for sending an error message in a text channel.
        * @param {string} key - The key for translating the error message.
        * @param {Array} args - An array of arguments to pass to the translation function.
        * @param {boolean} Embed - A boolean indicating whether to return an Embed object or send the embed message directly.
        */
		value: function (key, args, Embed) {
			try {
				const embed = new EmbedBuilder().setColor(16741245)
				.setDescription(`${this.client.translate(key, args, this.guild.settings.Language)}`);

				return Embed ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message, {
					error: err,
					client: this.client, 
					guild: this.guild
				});
			}
		}
	},

	success: {
		/**
        * A method for sending an success message in a text channel.
        * @param {string} key - The key for translating the success message.
        * @param {Array} args - An array of arguments to pass to the translation function.
        * @param {boolean} Embed - A boolean indicating whether to return an Embed object or send the embed message directly.
        */
		value: function (key, args, Embed) {
			try {
				const embed = new EmbedBuilder().setColor(10147968)
				.setDescription(`${this.client.translate(key, args, this.guild.settings.Language)}`);

				return Embed ? embed : this.send({ embeds: [embed] });
			} catch (err) {
				this.client.logger.error(err.message);
			}
		},
	},
});

module.exports = Object.defineProperties(VoiceChannel.prototype, {
	/**
 	* Joins the voice channel associated with this object.
 	*
	* @method
 	* @param {Object} options - Options for joining the voice channel.
 	* @param {boolean} [options.selfDeaf=false] - Whether to self-deafen upon joining.
 	* @param {boolean} [options.selfMute=false] - Whether to self-mute upon joining.
 	* @param {boolean} [options.Interval=false] - Whether to join periodically using setInterval.
 	* @returns {void}
 	* @throws {Error} Throws an error if the channel type is not GuildVoice.
 	*/
	join: {
		value: function({selfDeaf = false, selfMute = false, Interval = false} = {}) {
			if (this.type !== ChannelType.GuildVoice) {
				this.client.logger.error("the specified channel is not an audio channel!")
				return;
			}

			const connection = getVoiceConnection(this.guild.id)
			if (connection) return;
			
			if(Interval) {
				setInterval(async () => {
					const VoiceChannel = client.channels.cache.get(allah.BotSesKanal);
					if (VoiceChannel) { 
						joinVoiceChannel({
							channelId: this.id,
							guildId: this.guild.id,
							adapterCreator: this.guild.voiceAdapterCreator,
							group: client.user.id,
							selfDeaf: selfDeaf,
							selfMute: selfMute
						})
					}
				}, 5000);
			}

			joinVoiceChannel({
				channelId: this.id,
				guildId: this.guild.id,
				adapterCreator: this.guild.voiceAdapterCreator,
				group: client.user.id,
				selfDeaf: selfDeaf,
				selfMute: selfMute
			})
		}
	}
});


const oriSend = TextChannel.prototype.send;
TextChannel.prototype.send = function (...args) {
	const send = oriSend.bind(this);
	if (!this.permissionsFor(this.client.user).has(Flags.SendMessages)) return;
	if (!this.permissionsFor(this.client.user).has(Flags.EmbedLinks)) {
		return send(this.client.translate('misc:MISSING_PERMISSION', { PERMISSIONS: this.client.translate('permissions:EMBED_LINKS', {}, this.guild.settings.Language) }, this.guild.settings.Language));
	}

	try {
		if (args[0].collector) return send(...args)

		return send(...args).then(message => {
			setTimeout(() => {
				if (message && message.deletable) message.delete().catch(err => {})
			}, args[0].delete * 1000 || 15 * 1000);
		}).catch((e) => {});
	} catch (err) {}
};