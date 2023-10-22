
module.exports = {
    PrefixCommands: async function (client, message) {
        const prefixes = [...client.Vante.Prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`];
        const cooldown = client.cooldowns.get(`${cmd.Name}-${message.author.id}`);
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
                if (!message.channel.permissionsFor(message.guild.members.me).has('SendMessages')) return;
                if (cooldown && cooldown.activated) return;

                if (cmd.Category === 'Root' && !client.system.ownerID.includes(message.author.id)) {
                    return client.systemEmbed(message, message.translate('misc:OWNER_ONLY'))
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

                if (cooldown && Date.now() < cooldown.expires) {
                    client.systemEmbed(message, message.translate('misc:COOLDOWNED', { TIME: client.timestamp(cooldown.expires) }), cooldown.expires);
                    return client.cooldowns.set(`${cmd.Name}-${message.author.id}`, {
                        activated: true,
                    });
                };

                try {
                    await cmd.messageRun(client, message, args);
                } catch (ex) {
                    client.systemEmbed(message, message.translate('misc:ERROR_MESSAGE', {err: ex}))
                    client.logger.error('messageRun', {
                        error: ex,
                        guild: message.guild,
                        client: client,
                    });
                  } finally {
                    if (cmd.Cooldown > 0) client.cooldowns.set(`${cmd.Name}-${message.author.id}`, {
                        activated: true,
                        expires: Date.now() + cmd.Cooldown * 1000
                    });
                    
                    setTimeout(() => { client.cooldowns.delete(`${cmd.Name}-${message.author.id}`); }, cmd.Cooldown * 1000);
                    client.logger.log(`Command: ${cmd.Name} was ran by ${message.author.tag}${!message.guild ? ' in DM\'s' : ` in guild: ${message.guild.name}`}.`);
                };
            };
        };
    }
};