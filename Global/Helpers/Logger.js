const { green, cyan, yellow, red } = require('chalk'), moment = require('moment');
const { EmbedBuilder } = require('discord.js');

module.exports = class Logger {
    static success(content) {
        console.log(`[${moment().format('l')}]: ( ${green('SUCCESS')} ) ${cyan(`${content}`)}`);
    };

    static async debug(content) {
        console.log(`[${moment().format('l')}]: ( ${green('DEBUG')} ) ${cyan(`${content}`)}`);

        const debugWebhook =  global.client.Vante.Debugger ? global.client.getWebhook('Debug') : null;
        
        if (debugWebhook) {
            const VanteEmbed = new EmbedBuilder().setDescription(`\`\`\`ansi\n[2;32m[2;34m[2;34m${content}[0m[2;34m[0m[2;32m[0m\n\`\`\``)

            debugWebhook.send({
                username: global.client.user.tag ? global.client.user.tag : 'Unknown Client', 
                avatarURL: global.client.user.displayAvatarURL(), 
                embeds: [VanteEmbed] 
            })

        }
    };

    static log(content) {
        console.log(`[${moment().format('l')}]: ( ${cyan('LOG')} ) ${cyan(`${content}`)}`);
    };

    static warn(content) {
        console.log(`[${moment().format('l')}]: ( ${yellow('WARN')} ) ${cyan(`${content}`)}`);

    };


    static async error(content, options) {
        if (options?.error) {
            console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`${options.error}`)}`);

            const errorWebhook = global.client.getWebhook('System');

            if (errorWebhook) {
                if (options.error) if (options.error.length > 950) options.error = options.error.slice(0, 950) + '...';
                if (options.error.stack) if (options.error.stack.length > 950) options.error.stack = options.error.stack.slice(0, 950) + '...';

                const VanteEmbed = new EmbedBuilder()
                .setAuthor({ name: `${options.client.user.tag} (${options.client.user.id})`, iconURL: options.client.user.displayAvatarURL() })
                .addFields(
                    { name: '\u200B', value: options.error ? `\`\`\`ansi\n[2;31m` + options.error + `[0m[2;31m[0m\n\`\`\`` : '\u200B'},
                    { name: '\u200B', value: options.error.stack ? `\`\`\`js\n` + options.error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './') + `\n\`\`\`` : '\u200B'},
                )

                errorWebhook.send({
                    username: options.guild.name ? options.guild.name + `( ${options.guild.id} )` : 'Unknown Guild', 
                    avatarURL: options.guild.iconURL() ? options.guild.iconURL() : 'https://cdn.discordapp.com/embed/avatars/1.png', 
                    embeds: [VanteEmbed] 
                })
            } 
        } else {
            console.log(`[${moment().format('l')}]: ( ${red('ERROR')} ) ${cyan(`${content}`)}`);
        }
    };

    static async loaded(client) {
        console.log(`[${moment().format('l')}]: ( ${green('SUCCESS')} ) ${cyan(`${`Application @` + client.user.tag + ' started'}`)}`);
    }

    static line(content) {
        console.log(`[${moment().format('l')}]: ${cyan(`――――――――――――――――――――――――――――――――――――――――――――――――――――――――`)}`);
    };
}