const {PermissionsBitField} = require("discord.js"), { Owners } = require("@root/System"), { Functions: { toDiscordTimestamp } } = require("@utils/vante");

module.exports = {
    Message: async function (client, message, command) {
        const prefix = client.Vante.Commands.Prefix;
        const args = message.content.substring(prefix.some(x => x.length)).split(" ").splice(1);
        const cmd = command;

        if (!message.channel.permissionsFor(message.guild.members.me).has("SendMessages")) return;
        if (client.cooldowned.has(`${cmd}-${message.author.id}`)) return;

        if (cmd.Category === "Root" && !Owners.includes(message.author.id)) {
            return client.embed(message, message.translate("misc:OWNER_ONLY"));
        }

        if (message.guild) {
            let neededPermissions = [];
            if (cmd.Authory && cmd.Authory.Client) {
                cmd.Authory.Client.forEach((perm) => {
                    if ([PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Connect].includes(perm)) {
                        if (!message.member.voice.channel) return;
                        if (!message.member.voice.channel.permissionsFor(bot.user).has(perm)) {
                            neededPermissions.push(perm);
                        }
                    } else if (!message.channel.permissionsFor(bot.user).has(perm)) {
                        neededPermissions.push(perm);
                    }
                });
            }

            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                client.logger.error(`Missing permission: \`${perms.toArray().join(', ')}\` in [${message.guild.id}].`);
                if (message.deletable) message.delete();
                return client.embed(message, message.translate("misc:MISSING_BOT_PERMS", { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }))
            }

            
            neededPermissions = [];
            if (cmd.Authory && cmd.Authory.User) {
                cmd.Authory.User.forEach((perm) => {
                    if (!message.channel.permissionsFor(message.member).has(perm)) {
                        neededPermissions.push(perm);
                    }
                });
            }

            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                if (message.deletable) message.delete();
                return client.embed(message, message.translate("misc:MISSING_MEMBER_PERMS", { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }))
            }
        }

        if (client.cooldowns.has(`${cmd}-${message.author.id}`)) {
            const lastTime = client.cooldowns.get(`${cmd}-${message.author.id}`);
            const cooldownExpiration = lastTime + cmd.Cooldown * 1000;
            const cooldowned = Date.now() + cmd.Cooldown * 1000

            if (Date.now() < cooldownExpiration) {
                const remainingTime = (cooldownExpiration - Date.now()) / 1000;
                client.embed(message, message.translate("misc:COOLDOWNED", { TIME: await toDiscordTimestamp(cooldowned) }), cmd.Cooldown * 1000);
                client.cooldowned.set(`${cmd}-${message.author.id}`, Date.now());
                setTimeout(() => { client.cooldowned.delete(`${cmd}-${message.author.id}`); }, cmd.Cooldown * 1000);
                return;
            }
        }

        try {
            await cmd.messageRun(client, message, args);
        } catch (ex) {
            await client.embed(message, message.translate("misc:ERR_OCCURRED"));
            client.logger.error("messageRun", {
                error: ex,
                guild: message.guild,
                client: client,
            });
          } finally {
            client.commandsUsed++;
            if (cmd.Cooldown > 0) client.cooldowns.set(`${cmd}-${message.author.id}`, Date.now());
            setTimeout(() => { client.cooldowns.delete(`${cmd}-${message.author.id}`); }, cmd.Cooldown * 1000);
            client.logger.log(`Command: ${cmd.Name} was ran by ${message.author.tag}${!message.guild ? ' in DM\'s' : ` in guild: ${message.guild.name}`}.`);
        }
    },

    Interaction: async function (client, interaction) {
        const cmd = interaction.client.slashcommands.get(interaction.commandName);
        if (!cmd) return client.embed(interaction, interaction.guild.translate("misc:ERR_OCCURRED"));

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has("SendMessages")) return;
        if (client.cooldowned.has(`${cmd}-${interaction.user.id}`)) return;

        if (cmd.Category === "Root" && !Owners.includes(interaction.user.id)) {
            return client.embed(interaction, interaction.guild.translate("misc:OWNER_ONLY"));
        }

        let neededPermissions = [];
        if (cmd.Authory && cmd.Authory.Client) {
		    cmd.Authory.Client.forEach((perm) => {
			    if ([PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Connect].includes(perm)) {
				    if (!member.voice.channel) return;
				    if (!member.voice.channel.permissionsFor(client.user).has(perm)) {
					    neededPermissions.push(perm);
				    }
			    } else if (!channel.permissionsFor(client.user)?.has(perm)) {
				    neededPermissions.push(perm);
			    }
		    });
        }

		if (neededPermissions.length > 0) {
			const perms = new PermissionsBitField();
			neededPermissions.forEach((item) => perms.add(BigInt(item)));
			client.logger.error(`Missing permission: \`${perms.toArray().join(', ')}\` in [${guild.id}].`);
			return client.embed(interaction, interaction.translate("misc:MISSING_BOT_PERMS", { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }))
		}

		neededPermissions = [];
        if (cmd.Authory && cmd.Authory.User) {
		    cmd.Authory.User.forEach((perm) => {
			    if (!channel.permissionsFor(member).has(perm)) neededPermissions.push(perm);
		    });
        };

		if (neededPermissions.length > 0) {
			const perms = new PermissionsBitField();
			neededPermissions.forEach((item) => perms.add(BigInt(item)));
			return client.embed(interaction, interaction.translate("misc:MISSING_MEMBER_PERMS", { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }))
		}

        if (client.cooldowns.has(`${cmd}-${interaction.user.id}`)) {
            const lastTime = client.cooldowns.get(`${cmd}-${interaction.user.id}`);
            const cooldownExpiration = lastTime + cmd.Cooldown * 1000;
            const cooldowned = Date.now() + cmd.Cooldown * 1000

            if (Date.now() < cooldownExpiration) {
                const remainingTime = (cooldownExpiration - Date.now()) / 1000;
                client.embed(interaction, interaction.guild.translate("misc:COOLDOWN", { TIME: await toDiscordTimestamp(cooldowned) }), cmd.Cooldown * 1000);
                client.cooldowned.set(`${cmd}-${interaction.user.id}`, Date.now());
                setTimeout(() => { client.cooldowned.delete(`${cmd}-${interaction.user.id}`); }, cmd.Cooldown * 1000);
                return;
            }
        }

        try {
            await interaction.deferReply({ ephemeral: cmd.Command.Ephemeral });
            await cmd.interactionRun(client, interaction);
        } catch (ex) {
            await client.embed(interaction, interaction.translate("misc:ERR_OCCURRED"));
            interaction.client.logger.error("interactionRun", {
                error: ex,
                guild: interaction.guild,
                client: client,
            });
        } finally {
            client.commandsUsed++;
            if (cmd.Cooldown > 0) client.cooldowns.set(`${cmd}-${interaction.user.id}`, Date.now());
            setTimeout(() => { client.cooldowns.delete(`${cmd}-${interaction.user.id}`); }, cmd.Cooldown * 1000);
            client.logger.log(`Command: ${cmd.Name} was ran by ${interaction.user.tag}${!interaction.guild ? ' in DM\'s' : ` in guild: ${interaction.guild.name}`}.`);
        }
    }
};
