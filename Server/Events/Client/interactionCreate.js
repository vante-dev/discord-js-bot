const { Events } = require("discord.js");

module.exports = async (client, interaction) => {
    if (!interaction.guild) {
        return interaction.reply({ embeds: [client.embed(interaction, { 
            description: interaction.translate("misc:GUILD_ONLY")
        })]})
    };

    if (interaction.isChatInputCommand()) {
        const cmd = interaction.client.slashcommands.get(interaction.commandName);
        if (!cmd) return client.systemEmbed(interaction, interaction.guild.translate("misc:ERROR"));

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has("SendMessages")) return;
        if (client.cooldowned.has(`${cmd.Name}-${interaction.user.id}`)) return;

        if (cmd.Category === "Root" && !client.system.ownerID.includes(interaction.user.id)) {
            return client.systemEmbed(interaction, interaction.translate("misc:OWNER_ONLY"))
        }

        if (interaction.guild) {
            let neededPermissions = [];
            if (cmd.Permissions && cmd.Permissions.Bot) cmd.Permissions.Bot.forEach((perm) => {
                if (!interaction.channel.permissionsFor(client.user).has(perm)) {
                    neededPermissions.push(perm);
                };
            });

            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                client.logger.error(`Missing permission: \` ${perms.toArray().join(', ')} \` in [${interaction.guild.id}].`);
                if (interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) {
                    return interaction.user.send({ content: interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') }) }).then(() => {
                    }).catch(() => {
                        return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') }));
                    });
                } else {
                    client.logger.error(`Missing permission: \`${neededPermissions.join(', ')}\` in [${interaction.guild.id}].`);
                    return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') }));
                }
            }

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
            }
        };


        if (client.cooldowns.has(`${cmd.Name}-${interaction.user.id}`)) {
            const lastTime = client.cooldowns.get(`${cmd.Name}-${interaction.user.id}`);
            const cooldownExpiration = lastTime + cmd.Cooldown * 1000;
            const cooldowned = Date.now() + cmd.Cooldown * 1000

            if (Date.now() < cooldownExpiration) {
                client.systemEmbed(interaction, interaction.translate("misc:COOLDOWNED", { TIME: client.timestamp(cooldowned) }), cmd.Cooldown * 1000)
                client.cooldowned.set(`${cmd.Name}-${interaction.user.id}`, Date.now());
                setTimeout(() => { client.cooldowned.delete(`${cmd.Name}-${interaction.user.id}`); }, cmd.Cooldown * 1000);
                return;
            }
        }

        try {
            await interaction.deferReply({ ephemeral: cmd.Command.Ephemeral });
            await cmd.interactionRun(client, interaction);
        } catch (ex) {
            i
            93
            
            client.logger.error("interactionRun", {
                error: ex,
                guild: interaction.guild,
                client: client,
            });
        } finally {
            client.commandsUsed++;
            if (cmd.Cooldown > 0) client.cooldowns.set(`${cmd.Name}-${interaction.user.id}`, Date.now());
            setTimeout(() => { client.cooldowns.delete(`${cmd.Name}-${interaction.user.id}`); }, cmd.Cooldown * 1000);
            client.logger.log(`Command: ${cmd.Name} was ran by ${interaction.user.tag}${!interaction.guild ? ' in DM\'s' : ` in guild: ${interaction.guild.name}`}.`);
        }
    }

    if (interaction.isContextMenuCommand()) {
        const context = client.contextcommands.get(interaction.commandName);

        if (context) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has("SendMessages")) return;

            if (client.cooldowned.has(`${context.Name}-${interaction.user.id}`)) return;

            if (client.cooldowns.has(`${context.Name}-${interaction.user.id}`)) {
                const lastTime = client.cooldowns.get(`${context.Name}-${interaction.user.id}`);
                const cooldownExpiration = lastTime + context.Cooldown * 1000;
                const cooldowned = Date.now() + context.Cooldown * 1000;
          
                if (Date.now() < cooldownExpiration) {
                  client.systemEmbed(interaction, interaction.translate("misc:COOLDOWNED", { TIME: client.timestamp(cooldowned) }), context.Cooldown * 1000)
                  client.cooldowned.set(`${context.Name}-${interaction.user.id}`, Date.now());
                  setTimeout(() => {
                    client.cooldowned.delete(`${context.Name}-${interaction.user.id}`);
                  }, context.Cooldown * 1000);
                  return;
                }
            }

            if (interaction.guild) {
                let neededPermissions = [];
                if (context.Permissions && context.Permissions.Bot) context.Permissions.Bot.forEach((perm) => {
                    if (!interaction.channel.permissionsFor(client.user).has(perm)) {
						neededPermissions.push(perm);
					};
                });

                if (neededPermissions.length > 0) {
                    const perms = new PermissionsBitField();
                    neededPermissions.forEach((item) => perms.add(BigInt(item)));
                    client.logger.error(`Missing permission: \` ${perms.toArray().join(', ')} \` in [${interaction.guild.id}].`);
                    if (interaction.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) {
                        return interaction.user.send({ content: interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') }) }).then(() => {
						}).catch(() => {
							return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') }));
						});
                    } else {
                        client.logger.error(`Missing permission: \`${neededPermissions.join(', ')}\` in [${interaction.guild.id}].`);
						return interaction.channel.send(interaction.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') }));
                    }
                }

                neededPermissions = [];
                if (context.Permissions && context.Permissions.User) context.Permissions.User.forEach((perm) => {
					if (!interaction.channel.permissionsFor(interaction.user).has(perm)) {
						neededPermissions.push(perm);
					}
				});

                if (neededPermissions.length > 0) {
                    const perms = new PermissionsBitField();
					neededPermissions.forEach((item) => perms.add(BigInt(item)));
                    return interaction.channel.error('misc:USER_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => interaction.translate(`permissions:${p}`)).join(', ') })
                }
            };

            try {
                await interaction.deferReply({ ephemeral: context.Ephemeral });
                await context.run(client, interaction);
              } catch (ex) {
                client.systemEmbed(interaction, interaction.translate("misc:ERROR"));
                interaction.client.logger.error("contextRun", {
                  error: ex,
                  guild: interaction.guild,
                  client: client,
                });
              } finally {
                client.commandsUsed++;
                if (context.Cooldown > 0)
                  client.cooldowns.set(`${context.Name}-${interaction.user.id}`, Date.now());
                setTimeout(() => {
                  client.cooldowns.delete(`${context.Name}-${interaction.user.id}`);
                }, context.Cooldown * 1000);
                client.logger.log(
                  `Command: ${context.Name} was ran by ${interaction.user.tag}${
                    !interaction.guild
                      ? " in DM's"
                      : ` in guild: ${interaction.guild.name}`
                  }.`
                );
            }
        } else {
            client.systemEmbed(interaction, interaction.translate("misc:ERROR"));
        }
    }

};
  
module.exports.config = {
    Event: Events.InteractionCreate, System: true,
};