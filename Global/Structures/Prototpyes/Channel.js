const { EmbedBuilder, TextChannel, VoiceChannel, PermissionsBitField: { Flags } } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection} = require('@discordjs/voice');
 
module.exports = Object.defineProperties(TextChannel.prototype, {
	error: {
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
	join: {
		value: function({selfDeaf = false, selfMute = false, Interval = false} = {}) {
			if (this.type !== ChannelType.GuildVoice) {
				this.client.logger.error('the specified channel is not an audio channel!')
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
