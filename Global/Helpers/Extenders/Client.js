const { Client, EmbedBuilder, WebhookClient } = require('discord.js');
const { Bot: { Monitor } } = require('../../Settings/Config');

module.exports = Object.defineProperties(Client.prototype, {
    embed: {
        value: function (interaction, data, cooldown) {
            const embed = new EmbedBuilder()
                .setColor(0x000001)
                .setDescription(`>>> ${data.substring(0, 3000)}`);

            if (!cooldown) {
                if (interaction.deferred) {

                    interaction.followUp({ embeds: [embed], ephemeral: true }).catch((e) => { });

                } else {

                    interaction.reply({ embeds: [embed], ephemeral: true }).catch((e) => { });
                }
            } else {
                if (interaction.deferred) {
                    interaction.followUp({ embeds: [embed], ephemeral: true, }).then(message => {
                        setTimeout(() => { if (message) message.delete() }, cooldown * 1000);
                    }).catch((e) => { });
                } else {

                    interaction.reply({ embeds: [embed], ephemeral: true }).then(message => {
                        setTimeout(() => { if (message) message.delete() }, cooldown * 1000);
                    }).catch((e) => { });
                }
            }
        }
    },

    timestamp: {
        value: function (date, flag = 'R') {
            function isInt(value) {
                return Number.isInteger(value);
            }

            if (typeof date === 'number' || isInt(date)) {
                return `<t:${Math.trunc(+date / 1000)}:${flag}>`;
            }
            return `<t:${Math.trunc(date.valueOf() / 1000)}:${flag}>`;
        }
    },

    delay: {
        value: function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },

    translate: {
        value: function (key, args, locale) {
            if (!locale) locale = this.Vante.Language;
            const language = this.translations.get(locale);
            if (!language) return 'Invalid language set in data.';
            return language(key, args);
        }
    },

    getWebhook: {
        value: function (id) {
            const webhookURL = Monitor.find(hook => hook.ID === id) ? Monitor.find(hook => hook.ID === id).Webhook : undefined

            if (webhookURL) {
                const parts = webhookURL.split('/').slice(-2);

                const id = parts[0];
                const token = parts[1];

                return new WebhookClient({ url: `https://discord.com/api/webhooks/${id}/${token}` }) ?? undefined;
            }

            return undefined
        }
    },

    getEmoji: {
        value: function (emojiName) {
            const emoji = this.emoji[emojiName];
            return emoji || null;
        },
    },
});