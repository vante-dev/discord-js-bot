const { Client, EmbedBuilder } = require("discord.js")

module.exports = Object.defineProperties(Client.prototype, {
    /**
    * Create an embed with specified options.
    * @param {Message} message - The message associated with the embed.
    * @param {Object} opt - Options for configuring the embed.
    * @param {number} [opt.color=0x000001] - The color of the embed.
    * @param {Object} [opt.footer] - Footer settings for the embed.
    * @param {string} [opt.footer.text='Developed By Vante'] - The text of the footer.
    * @param {string} [opt.footer.icon] - The icon URL of the footer.
    * @param {boolean} [opt.timestamp=false] - Whether to include a timestamp in the footer.
    * @param {Object} [opt.author] - Author settings for the embed.
    * @param {string} [opt.author.name] - The name of the author.
    * @param {string} [opt.author.icon] - The icon URL of the author.
    * @param {string} [opt.description] - The description of the embed.
    * @param {Array<Object>} [opt.fields] - An array of field objects for the embed.
    * @param {string} [opt.image] - The image URL for the embed.
    * @param {string} [opt.thumbnail] - The thumbnail URL for the embed.
    * @param {string} [opt.title] - The title of the embed.
    * @param {string} [opt.url] - The URL for the title of the embed.
    * @returns {EmbedBuilder} The created embed instance.
    */
    embed: {
		value: function (message, opt) {
            const embed = new EmbedBuilder()
                .setColor(opt.color || 0x000001)
                .setFooter({ text: opt.footer?.text || 'Developed By Vante', iconURL: message?.member.displayAvatarURL({ dynamic: true, size: 1024 }) || opt.footer?.icon || this.user.avatarURL({ size: 1024 }) })
                
            if(opt.author && (opt.author.name || opt.author.icon)) 
                embed.setAuthor({ name: opt.author?.name || null, iconURL: opt.author.icon || null });

            if(opt.description) 
                embed.setDescription(opt.description);

            if(opt.fields && opt.fields.length > 0) 
                embed.setFields(opt.fields);

            if(opt.image) 
                embed.setImage(opt.image);

            if(opt.thumbnail) 
                embed.setThumbnail(opt.thumbnail);

            if(opt.title) 
                embed.setTitle(opt.title);

            if(opt.url) 
                embed.setURL(opt.url);

            if(opt.timestamp) 
                embed.setTimestamp();

            return embed;
        }
    },


    /**
    * Generates and sends an embedded message as a response to an interaction.
    * @param {Interaction} interaction - The interaction object from the user.
    * @param {string} data - The data to include in the message.
    * @param {number} cooldown - The cooldown duration for message deletion (in milliseconds).
    */
    systemEmbed: {
        value: function (interaction, data, cooldown) {
            const embed = new EmbedBuilder()
                .setColor(0x000001)
                .setFooter({ text: 'Developed By Vante', iconURL: interaction?.member.displayAvatarURL({ dynamic: true, size: 1024 }) || interaction.user.avatarURL({ size: 1024 }) })
                .setDescription(`>>> ${data.substring(0, 3000)}`);

            if(!cooldown) {
                if (interaction.deferred) {

                    interaction.followUp({ embeds: [embed], ephemeral: true }).then(x => {
                        setTimeout(() => {
                            if (x && x.deletable) x.delete().catch(err => {})
                        }, 15 * 1000);
                    }).catch((e) => {});

                } else {

                    interaction.reply({ embeds: [embed], ephemeral: true }).then(x => {
                        setTimeout(() => {
                            if (x && x.deletable) x.delete().catch(err => {})
                        }, 15 * 1000);
                    }).catch((e) => {});
                }
            } else {
                if (interaction.deferred) {

                    interaction.followUp({ embeds: [embed], ephemeral: true }).then(x => {
                        setTimeout(() => {
                            if (x && x.deletable) x.delete().catch(err => {})
                        }, cooldown);
                    }).catch((e) => {});
                } else {

                    interaction.reply({ embeds: [embed], ephemeral: true }).then(x => {
                        setTimeout(() => {
                            if (x && x.deletable) x.delete().catch(err => {})
                        }, cooldown);
                    }).catch((e) => {});

                }
            }
        }
    },

    /**
    * Generates a formatted timestamp for a given date.
    * @param {number | Date} date - The date or timestamp to be formatted.
    * @param {string} [flag="R"] - The formatting flag for the timestamp.
    * @returns {string} The formatted timestamp string.
    */
    timestamp: {
        value: function (date, flag = "R") {
            function isInt(value) {
                return Number.isInteger(value);
            }
    
            if (typeof date === 'number' || isInt(date)) {
                return `<t:${Math.trunc(+date / 1000)}:${flag}>`;
            }
            return `<t:${Math.trunc(date.valueOf() / 1000)}:${flag}>`;
        }
    },

    /**
    * Delays the execution by a specified number of milliseconds.
    * @param {number} ms - The number of milliseconds to delay execution by.
    * @returns {Promise<void>} A Promise that resolves after the specified delay.
    */
    delay: {
        value: function (ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },

    /**
    * A function to translate a given key using the provided locale and arguments.
    * @param {string} key - The translation key.
    * @param {Array} args - An array of arguments for the translation.
    * @param {string} locale - The locale for translation (optional).
    * @returns {string} The translated string or an error message.
    */
    translate: {
        value: function (key, args, locale){
            if (!locale) locale = this.system.Client.Language;
		    const language = this.translations.get(locale);
		    if (!language) return 'Invalid language set in data.';
		    return language(key, args);
        }
    }
});