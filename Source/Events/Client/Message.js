const { Events, EmbedBuilder } = require('discord.js');
const moment = require('moment')

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    moment.locale(message.guild?.settings.Language);
    if (message.content.includes(`${client.user.id}`)) {
        const commands = await client.application.commands.fetch();
        const embed = new EmbedBuilder().setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
        .setTitle(client.user.displayName.toUpperCase())
        .setDescription(`${message.translate('misc:BOT_PREFIX', { PREFIX: listPrefixs(message.guild?.settings.Prefix) })} ${message.guild?.settings.Client.Time !== "" && message.guild?.settings.Client.News !== "" ? `\n\n${message.translate('misc:NEWS', {  
            DATE: moment(message.guild?.settings.Client.Time).format('DD/MM/YYYY'),
            DATE2: moment(message.guild?.settings.Client.Time).fromNow(),
            NEWS: message.guild?.settings.Client.News
        })}` : ''}`)
        .setFooter({ text: message.translate('misc:FOOTER') })
        .addFields(
            {
                name: 'Bug',
                value: message.translate('misc:BUG', { COMMAND: 
                    commands.find(c => c.name === 'bug')?.id ?? '0'
                }),
                inline: true
            },
            {
                name: 'Feedback',
                value: message.translate('misc:FEEDBACK', { COMMAND: 
                    commands.find(c => c.name === 'feedback')?.id ?? '0'
                }),
                inline: true
            },
            {
                name: 'Support',
                value: message.translate('misc:SUPPORT', { LINK: 
                    client.system.serverLink
                }),
                inline: false
            },
        )

        return message.reply({ embeds: [embed], delete: 30 });
    };


    const prefixes = [...client.Vante.Prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`];
    const content = message.content;

    const prefixUsed = prefixes.find(p => content.startsWith(p));
    let args;

    if (prefixUsed) {
        args = content.slice(prefixUsed.length).trim().split(/ +/);
        const command = args[0].toLowerCase();
        let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        args.shift();

        if (!cmd && [`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(prefixUsed)) {
            cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
            args.shift();
    };

    if (cmd) {
        const cooldown = client.cooldowns.get(`${cmd.Name}-${message.author.id}`)
        if (!message.channel.permissionsFor(message.guild.members.me).has('SendMessages')) return;
        if (cooldown && cooldown.Activated) return;

        if (cmd.Category === 'Root' && !client.system.ownerID.includes(message.author.id)) {
            return client.embed(message, message.translate('misc:OWNER_ONLY'))
        };

        if (message.guild) { 
            let neededPermissions = [];
            if (cmd.Permissions && cmd.Permissions.Bot) cmd.Permissions.Bot.forEach((perm) => {
                if (!channel.permissionsFor(client.user)?.has(perm)) {
                    neededPermissions.push(perm);
                };
            });

            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                if (message.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) {
                    return message.author.send({ content: message.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }), guild: message.guild }).then(() => {
                    }).catch(() => {
                        return message.channel.send(message.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', '), guild: message.guild }));
                    });
                } else {
                    return message.channel.send(message.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', '), guild: message.guild }));
                }
            };

            
            neededPermissions = [];
            if (cmd.Permissions && cmd.Permissions.User) cmd.Permissions.User.forEach((perm) => {
                if (!message.channel.permissionsFor(message.member).has(perm)) {
                    neededPermissions.push(perm);
                }
            });

            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                return message.channel.error('misc:USER_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') })
            };

            neededPermissions = [];
            if (cmd.Permissions && cmd.Permissions.Role) cmd.Permissions.Role.forEach((group) => {
                const hasRoleInGroup = group.some((role) =>
                    message.member.roles.cache.some((userRole) => userRole.id === role)
                );
        
                if (!hasRoleInGroup) {
                    missingRoles.push(group.join(' or '));
                }
            });

            if (neededPermissions.length > 0) return;
        };

        if (cooldown && Date.now() < cooldown.Expiration) {
            client.embed(message, message.translate('misc:COOLDOWNED', { TIME: client.timestamp(cooldown.Expiration) }), Math.ceil((cooldown.Expiration - Date.now()) / 1000))
            return client.cooldowns.set(`${cmd.Name}-${message.author.id}`, {
                Activated: true,
            });
        };

        try {
            await cmd.messageRun(client, message, args);
        } catch (ex) {
            client.embed(message, message.translate('misc:ERROR_MESSAGE', {err: ex}));
            client.logger.error('messageRun', {
                error: ex,
                guild: message.guild,
                client: client,
            });
        } finally {
            if (cmd.Cooldown > 0) {
                client.cooldowns.set(`${cmd.Name}-${message.author.id}`, {
                    Expiration: Date.now() + (cmd.Cooldown * 1000),
                    Activated: false,
                });

            }

            setTimeout(() => {
                if (client.cooldowns.has(`${cmd.Name}-${message.author.id}`)) {
                    client.cooldowns.delete(`${cmd.Name}-${message.author.id}`);
                }
            }, cmd.Cooldown * 1000);
                      
            client.logger.log(`Command: ${cmd.Name} was ran by ${message.author.tag}${!message.guild ? ' in DM\'s' : ` in guild: ${message.guild.name}`}.`);
        }
    };
};
};
  
module.exports.config = {
    Event: Events.MessageCreate, Development: false,
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