const { EmbedBuilder, TextChannel, VoiceChannel, PermissionsBitField: { Flags } } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");

module.exports = Object.defineProperties(TextChannel.prototype, {
	/**
 	* Send an error message to the text channel, optionally using an embed.
 	* @param {string} key - The translation key for the error message.
 	* @param {Object} [args] - Optional arguments to replace placeholders in the translation.
 	* @param {Class} [Embed] - Optional class for creating an embed.
 	* @returns {void|EmbedBuilder} If `Embed` is provided, returns the embed instance;
	* otherwise, sends the error message and deletes it after a delay.
 	*/
	error: {
		value: function (key, args, Embed) {
			try {

				const embed = new EmbedBuilder().setColor(16741245)
				.setDescription(`${this.client.translate(key, args, this.guild.settings.language)}`);

				return Embed ? embed : this.send({ embeds: [embed] })
			} catch (err) {
				this.client.logger.error(err.message, {
					error: err,
					client: this.client, 
					guild: this.guild
				});
			}
		}
	},

	/**
 	* Send a success message to the text channel, optionally using an embed.
 	* @param {string} key - The translation key for the success message.
 	* @param {Object} [args] - Optional arguments to replace placeholders in the translation.
 	* @param {Class} [Embed] - Optional class for creating an embed.
 	* @returns {Promise<void>|Promise<EmbedBuilder>} If `Embed` is provided, returns the embed instance;
 	* otherwise, sends the success message and deletes it after a delay.
 	*/
	success: {
		value: function (key, args, Embed) {
			try {
				const embed = new EmbedBuilder().setColor(10147968)
				.setDescription(`${this.client.translate(key, args, this.guild.settings.language)}`);

				return Embed ? embed : this.send({ embeds: [embed] })
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


// override send method
const oriSend = TextChannel.prototype.send;
TextChannel.prototype.send = function (...args) {
	const send = oriSend.bind(this);
	// check permissions
	if (!this.permissionsFor(this.client.user).has(Flags.SendMessages)) return;
	if (!this.permissionsFor(this.client.user).has(Flags.EmbedLinks)) {
		return send(this.client.translate('misc:MISSING_PERMISSION', { PERMISSIONS: this.client.translate('permissions:EMBED_LINKS', {}, this.guild.settings.language) }, this.guild.settings.language));
	}

	// send message
	try {
		if (args[0].components) return send(...args)

		return send(...args).then(message => {
			setTimeout(() => {
				if (message && message.deletable) message.delete().catch(err => {})
			}, args[0].delete * 1000 || 15 * 1000);
		}).catch((e) => {});
	} catch (err) {}
};