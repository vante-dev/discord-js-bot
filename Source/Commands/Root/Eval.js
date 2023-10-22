const { ApplicationCommandOptionType: { String }, EmbedBuilder } = require('discord.js'); 
const { Link: { postToBin }, Format: { truncate, clean} } = require('../../../Global/Helpers');
const { inspect } = require('util');

module.exports = {
    Name: 'eval',
    Aliases: [],
    Description: 'Eval a JS code.',
    Usage: 'eval client.users.cache.get(`797096076330795018`)',
    Category: 'Root',
    Cooldown: 10,

    Permissions: {
        User: [],
        Bot: [],
        Role: []
    },

    Command: {
        Prefix: true,
        Slash: true,
        Ephemeral: true,
        
        Options: [
            {
                name: 'code',
                description: 'code to evaluate',
                type: String,
            }
        ],
    },

    messageRun: async (client, message, args, settings) => {
        try {
            const code = args.join(' ');
            if (!code) return message.reply('Please provide code to eval');

            let evaled = eval(code);
            let promise, output, bin, type;

            if (evaled instanceof Promise) {
                message.channel.sendTyping();
                promise = await evaled.then(res => { return { resolved: true, body: inspect(res, { depth: 0 }) }; }).catch(err => { return { rejected: true, body: inspect(err, { depth: 0 }) }; });
            };

            if (typeof evaled !== 'string') {
                evaled = inspect(evaled, { depth: 0 });
            };

            if (promise) {
                output = clean(promise.body)
            } else {
                output = clean(evaled)
            };

            if (promise?.resolved) {
                type = 'Promise (Resolved)'
            } else if (promise?.rejected) {
                type = 'Promise (Rejected)'
            } else {
                type = (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1)
            };

            const elapsed = Math.abs(Date.now() - message.createdTimestamp);
            
            const embed = new EmbedBuilder()
            .addFields({ name: '📥 Input', value: `\`\`\`js\n${truncate(clean(code), 1000)}\`\`\``, inline: false })
            .setFooter({text: [`${type !== 'Undefined' ? `Type: ${type}\u2000•\u2000` : ''}Evaluated in ${elapsed}ms.`,`command eval`].join('\u2000•\u2000')});

            if (output.length > 1000) {
                bin = await postToBin(output, `${truncate(clean(code), 1000)}`)
            }

            embed.addFields([
                {
                    name: '\\📤 Output',
                    value: output.length > 1000 ? `\`\`\`fix\nExceeded 1000 characters\nCharacter Length: ${output.length}\`\`\`` : `\`\`\`js\n${output}\n\`\`\``
                },
                {
                    name: '\u200b', 
                    value: `[\` 📄 View  \`](${bin?.raw})` 
                }
            ].splice(0, Number(output.length > 1000) + 1))

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: '📤 Error' })
                .setDescription('```js\n' + (error.length > 4096 ? `${error.substr(0, 4000)}...` : error) + '\n```')
                .setTimestamp(Date.now());

            return message.channel.send({embeds: [embed]})
        }
    },

    interactionRun: async (client, interaction, settings) => {
        try {
            const code = interaction.options.getString('code');
            if (!code) return interaction.followUp('Please provide code to eval');

            let evaled = eval(code);
            let promise, output, bin, type;

            if (evaled instanceof Promise) {
                promise = await evaled.then(res => { return { resolved: true, body: inspect(res, { depth: 0 }) }; }).catch(err => { return { rejected: true, body: inspect(err, { depth: 0 }) }; });
            };

            if (typeof evaled !== 'string') {
                evaled = inspect(evaled, { depth: 0 });
            };

            if (promise) {
                output = clean(promise.body)
            } else {
                output = clean(evaled)
            };

            if (promise?.resolved) {
                type = 'Promise (Resolved)'
            } else if (promise?.rejected) {
                type = 'Promise (Rejected)'
            } else {
                type = (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1)
            };

            const elapsed = Math.abs(Date.now() - interaction.createdTimestamp);
            
            const embed = new EmbedBuilder()
            .addFields({ name: '\u200B', value: `\`\`\`js\n${truncate(clean(code), 1000)}\`\`\``, inline: false })
            .setFooter({text: [`${type !== 'Undefined' ? `Type: ${type}\u2000•\u2000` : ''}Evaluated in ${elapsed}ms.`,`command eval`].join('\u2000•\u2000')});

            if (output.length > 1000) {
                bin = await postToBin(output, `${truncate(clean(code), 1000)}`)
            }

            embed.addFields([
                {
                    name: '\u200B',
                    value: output.length > 1000 ? `\`\`\`fix\nExceeded 1000 characters\nCharacter Length: ${output.length}\`\`\`` : `\`\`\`js\n${output}\n\`\`\``
                },
                {
                    name: '\u200b', 
                    value: `[\` 📄 View  \`](${bin?.raw})` 
                }
            ].splice(0, Number(output.length > 1000) + 1))

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setDescription('```js\n' + (error.length > 4096 ? `${error.substr(0, 4000)}...` : error) + '\n```')
                .setColor('Red')
                
            return interaction.followUp({embeds: [embed]})
        }
    },
};