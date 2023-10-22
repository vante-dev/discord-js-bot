const { Events, PermissionsBitField } = require('discord.js');

module.exports = async (client, interaction) => {
    if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
        const guild = interaction.guild,
        cmd = client.contextMenus.get(interaction.commandName),
        channel = guild?.channels.cache.get(interaction.channelId),
        member = guild?.members.cache.get(interaction.user.id);
        const cooldown = client.cooldowns.get(`${cmd.Name}-${interaction.user.id}`);

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

            if (neededPermissions.length > 0) return;
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
            await cmd.run(client, interaction, { settings });
        } catch (ex) {
            client.logger.error('interactionRun', {
                error: ex,
                guild: interaction.guild,
                client: client,
            });
        } finally {
            if (cmd.Cooldown > 0) {
                client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, {
                    Expiration: Date.now() + (cmd.Cooldown * 1000),
                    Activated: false,
                });

            }

            setTimeout(() => {
                if (client.cooldowns.has(`${cmd.Name}-${interaction.user.id}`)) {
                    client.cooldowns.delete(`${cmd.Name}-${interaction.user.id}`);
                }
            }, cmd.Cooldown * 1000);
            client.logger.log(`Context Command: ${cmd.Name} was ran by ${interaction.user.tag}${!interaction.guild ? ' in DM\'s' : ` in guild: ${interaction.guild.name}`}.`);
        };
    };

    if (interaction.isButton()) return client.emit('buttonCreate', interaction);
    if (interaction.isStringSelectMenu()) return client.emit('menuCreate', interaction);

    if (interaction.isCommand()) {
        const guild = interaction.guild,
        cmd = client.slashCommands.get(interaction.commandName),
        channel = guild?.channels.cache.get(interaction.channelId),
        member = guild?.members.cache.get(interaction.user.id);
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
                    missingRoles.push(group.join(' or '));
                }
            });

            if (neededPermissions.length > 0) return;
        };

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
            client.logger.error('interactionRun', {
                error: ex,
                guild: interaction.guild,
                client: client,
            });
        } finally {
            if (cmd.Cooldown > 0) {
                client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, {
                    Expiration: Date.now() + (cmd.Cooldown * 1000),
                    Activated: false,
                });
            }

            setTimeout(() => {
                if (client.cooldowns.has(`${cmd.Name}-${interaction.user.id}`)) {
                    client.cooldowns.delete(`${cmd.Name}-${interaction.user.id}`);
                }
            }, cmd.Cooldown * 1000);

            client.logger.log(`Command: ${cmd.Name} was ran by @${interaction.user.tag}${!interaction.guild ? ' in DM\'s' : ` in guild: ${interaction.guild.name}`}.`);
        };
    };
};

module.exports.config = {
    Event: Events.InteractionCreate, Development: false,
};