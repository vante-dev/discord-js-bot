const MessageCommandsHandler = async function (client, message) {
    if (!message.guild || message.author.bot) return;

    const prefixes = [...client.Vante.Prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`];
    const content = message.content;
    
    const prefixUsed = prefixes.find(p => content.startsWith(p));
    let args;

    if (prefixUsed) {
        args = content.slice(prefixUsed.length).trim().split(/ +/);
        const command = args[0].toLowerCase();
        var cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        args.shift();

        if (!cmd && [`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(prefixUsed)) {
            cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
            args.shift();
        };
    };

    if (cmd) {
        const cooldown = client.cooldowns.get(`${cmd.Name}-${message.author.id}`);
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
                    missingRoles.push(group.join(', '));
                }
            });

            if (neededPermissions.length > 0) return message.react("❌");
        };

        if (cooldown && Date.now() < cooldown.Expiration) {
            client.embed(message, message.translate('misc:COOLDOWNED', { TIME: client.timestamp(cooldown.Expiration) }), Math.ceil((cooldown.Expiration - Date.now()) / 1000))
            return client.cooldowns.set(`${cmd.Name}-${message.author.id}`, {
                Activated: true,
            });
        };

        try {
            await cmd.messageRun(client, message, args);
        } catch (err) { 
            const commands = await client.application.commands.fetch();
            client.embed(message, message.translate('misc:ERROR_MESSAGE', {
                err: err,
                command: commands.find(c => c.name === 'bug')?.id ?? '0'
            }));

            return client.logger.error('@messageRun', {
                error: err,
                guild: message.guild,
                client: client,
            });
        } finally {
            if (cmd.Cooldown > 0 && !cooldown) {
                client.cooldowns.set(`${cmd.Name}-${message.author.id}`, {
                    Expiration: Date.now() + (cmd.Cooldown * 1000),
                    Activated: false,
                });
            }

            setTimeout(() => {
                if (client.cooldowns.get(`${cmd.Name}-${message.author.id}`)) 
                 return client.cooldowns.delete(`${cmd.Name}-${message.author.id}`);
            }, cmd.Cooldown * 1000);
        };

        return client.logger.log(`Command: ${cmd.Name} was ran by ${message.author.tag}${!message.guild ? ' in DM\'s' : ` in guild: ${message.guild.name}`}.`);
    };
};


const SlashCommandsHandler = async function (client, interaction) {
    const 
    guild   = interaction.guild,
    cmd     = client.slashCommands.get(interaction.commandName),
    channel = guild?.channels.cache.get(interaction.channelId),
    member  = guild?.members.cache.get(interaction.user.id);

    const cooldown = client.cooldowns.get(`${cmd.Name}-${interaction.user.id}`);

    if (!cmd || cooldown && cooldown.Activated) return;

    if (cmd.Category === 'Root' && !client.system.ownerID.includes(interaction.user.id)) {
        return client.systemEmbed(interaction, interaction.translate('misc:OWNER_ONLY'))
    };

    if (guild) {
        let neededPermissions = [];
        if (cmd.Permissions && cmd.Permissions.Bot) cmd.Permissions.Bot.forEach((perm) => {
            if (!channel.permissionsFor(client.user)?.has(perm)) {
                neededPermissions.push(perm);
            };
        });

        if (neededPermissions.length > 0) {
            const perms = new PermissionsBitField();
            neededPermissions.forEach((item) => perms.add(BigInt(item)));
            if (interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) {
                return interaction.user.send({ content: interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', '), guild: interaction.guild }) }).then(() => {
                }).catch(() => {
                    return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', '), guild: interaction.guild }));
                });
            } else {
                return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', '), guild: interaction.guild }));
            }
        };

        neededPermissions = [];
        if (cmd.Permissions && cmd.Permissions.User) cmd.Permissions.User.forEach((perm) => {
            if (!interaction.channel.permissionsFor(interaction.user).has(perm)) {
                neededPermissions.push(perm);
            }
        });

        if (neededPermissions.length > 0) {
            const perms = new PermissionsBitField();
            neededPermissions.forEach((item) => perms.add(BigInt(item)));
            return interaction.channel.error('misc:USER_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') })
        };

        neededPermissions = [];
        if (cmd.Permissions && cmd.Permissions.Role) cmd.Permissions.Role.forEach((group) => {
            const hasRoleInGroup = group.some((role) =>
                member.roles.cache.some((userRole) => userRole.id === role)
            );
        
            if (!hasRoleInGroup) {
                missingRoles.push(group.join(', '));
            }
        });

        if (neededPermissions.length > 0) return interaction.react("❌");
    }

    if (cooldown && Date.now() < cooldown.Expiration) {
        client.embed(interaction, interaction.translate('misc:COOLDOWNED', { TIME: client.timestamp(cooldown.Expiration) }), Math.ceil((cooldown.Expiration - Date.now()) / 1000))
        return client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, {
            Activated: true,
        });
    };

    try {
        await interaction.deferReply({ ephemeral: cmd.Command.Ephemeral });
        const settings = interaction.guild.settings
        await cmd.interactionRun(client, interaction, { settings });
    } catch (ex) {
        const commands = await client.application.commands.fetch();
        client.embed(interaction, interaction.translate('misc:ERROR_MESSAGE', {
            err: ex,
            command: commands.find(c => c.name === 'bug')?.id ?? '0'
        }));

        client.logger.error('@interactionRun', {
            error: ex,
            guild: interaction.guild,
            client: client,
        });
    } finally {
        if (cmd.Cooldown > 0 && !cooldown) {
            client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, {
                Expiration: Date.now() + (cmd.Cooldown * 1000),
                Activated: false,
            });
        }

        setTimeout(() => {
            if (client.cooldowns.get(`${cmd.Name}-${interaction.user.id}`)) 
                client.cooldowns.delete(`${cmd.Name}-${interaction.user.id}`);
        }, cmd.Cooldown * 1000);
    };

    return client.logger.log(`Command: ${cmd.Name} was ran by @${interaction.user.tag}${!interaction.guild ? ' in DM\'s' : ` in guild: ${interaction.guild.name}`}.`);
};


const ContextCommandsHandler = async function (client, interaction) {
    const 
    guild    = interaction.guild,
    cmd      = client.contextMenus.get(interaction.commandName),
    channel  = guild?.channels.cache.get(interaction.channelId),
    member   = guild?.members.cache.get(interaction.user.id);
    cooldown = client.cooldowns.get(`${cmd.Name}-${interaction.user.id}`);

    if (!cmd || cooldown && cooldown.Activated) return;

    if (guild) {
        let neededPermissions = [];
        if (cmd.Permissions && cmd.Permissions.Bot) cmd.Permissions.Bot.forEach((perm) => {
            if (!channel.permissionsFor(client.user)?.has(perm)) {
                neededPermissions.push(perm);
            };
        });

        if (neededPermissions.length > 0) {
            const perms = new PermissionsBitField();
            neededPermissions.forEach((item) => perms.add(BigInt(item)));
            if (interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) {
                return interaction.user.send({ content: interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', '), guild: interaction.guild }) }).then(() => {
                }).catch(() => {
                    return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', '), guild: interaction.guild }));
                });
            } else {
                return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', '), guild: interaction.guild }));
            }
        };

        neededPermissions = [];
        if (cmd.Permissions && cmd.Permissions.User) cmd.Permissions.User.forEach((perm) => {
            if (!interaction.channel.permissionsFor(interaction.user).has(perm)) {
                neededPermissions.push(perm);
            }
        });

        if (neededPermissions.length > 0) {
            const perms = new PermissionsBitField();
            neededPermissions.forEach((item) => perms.add(BigInt(item)));
            return interaction.channel.error('misc:USER_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') })
        };

        neededPermissions = [];
        if (cmd.Permissions && cmd.Permissions.Role) cmd.Permissions.Role.forEach((group) => {
            const hasRoleInGroup = group.some((role) =>
                member.roles.cache.some((userRole) => userRole.id === role)
            );
    
            if (!hasRoleInGroup) {
                missingRoles.push(group.join(' or '));
            }
        });

        if (neededPermissions.length > 0) return interaction.react("❌");
    };

    if (cooldown && Date.now() < cooldown.Expiration) {
        client.embed(interaction, interaction.translate('misc:COOLDOWNED', { TIME: client.timestamp(cooldown.Expiration) }), Math.ceil((cooldown.Expiration - Date.now()) / 1000))
        return client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, {
            Activated: true,
        });
    };

    try {
        await interaction.deferReply({ ephemeral: cmd.Ephemeral });
        const settings = interaction.guild.settings
        await cmd.interactionRun(client, interaction, { settings });
    } catch (ex) {
        const commands = await client.application.commands.fetch();
        client.embed(interaction, interaction.translate('misc:ERROR_MESSAGE', {
            err: ex,
            command: commands.find(c => c.name === 'bug')?.id ?? '0'
        }));

        client.logger.error('@contextRun', {
            error: ex,
            guild: interaction.guild,
            client: client,
        });
    } finally {
        if (cmd.Cooldown > 0 && !cooldown) {
            client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, {
                Expiration: Date.now() + (cmd.Cooldown * 1000),
                Activated: false,
            });
        }

        setTimeout(() => {
            if (client.cooldowns.get(`${cmd.Name}-${interaction.user.id}`)) 
                client.cooldowns.delete(`${cmd.Name}-${interaction.user.id}`);
        }, cmd.Cooldown * 1000);
    };

    return client.logger.log(`Context: ${cmd.Name} was ran by @${interaction.user.tag}${!interaction.guild ? ' in DM\'s' : ` in guild: ${interaction.guild.name}`}.`);
}

module.exports = { ContextCommandsHandler, SlashCommandsHandler, MessageCommandsHandler}