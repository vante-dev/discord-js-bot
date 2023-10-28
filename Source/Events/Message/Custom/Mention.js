const moment = require('moment')
const { EmbedBuilder } = require('discord.js')
module.exports.run = async (client, message) => {
    moment.locale(message.guild?.settings.Language);
    const commands = await client.application.commands.fetch();
    const embed = new EmbedBuilder().setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
        .setTitle(client.user.displayName.toUpperCase())
        .setDescription(`${message.translate('misc:BOT_PREFIX', { PREFIX: listPrefixs(message.guild?.settings.Prefix) })} ${message.guild?.settings.NewsTime !== "" && message.guild?.settings.News !== "" ? `\n\n${message.translate('misc:NEWS', {
            DATE: moment(message.guild?.settings.NewsTime).format('DD/MM/YYYY'),
            DATE2: moment(message.guild?.settings.NewsTime).fromNow(),
            NEWS: message.guild?.settings.News
        })}` : ''}`)

        .setFooter({ text: message.translate('misc:FOOTER') })
        .addFields(
            {
                name: 'Bug',
                value: message.translate('misc:BUG', {
                    COMMAND:
                        commands.find(c => c.name === 'bug')?.id ?? '0'
                }),
                inline: true
            },
            {
                name: 'Feedback',
                value: message.translate('misc:FEEDBACK', {
                    COMMAND:
                        commands.find(c => c.name === 'feedback')?.id ?? '0'
                }),
                inline: true
            },
            {
                name: 'Support',
                value: message.translate('misc:SUPPORT', {
                    LINK:
                        client.system.serverLink
                }),
                inline: false
            },
        )

    return message.reply({ embeds: [embed], delete: 30 });
};

function listPrefixs(array) {
    if (array.length === 0) {
        return '';
    } else if (array.length === 1) {
        return String(array[0]);
    } else if (array.length === 2) {
        return `${array[0]} and ${array[1]}`;
    } else {
        const lastIndex = array.length - 1;
        const firstPart = array.slice(0, lastIndex).join(' ');
        const lastPart = array[lastIndex];
        return `${firstPart} and ${lastPart}`;
    }
}