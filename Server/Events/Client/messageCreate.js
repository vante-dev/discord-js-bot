const { Events, PermissionsBitField } = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot) return;

    client.messagesSent++

    if (client.Vante.Commands && message.content && client.Vante.Prefix.some(x => message.content.startsWith(x))) {
        let Prefix = client.Vante.Prefix; 
        let commands = message.content;

        Prefix.forEach(value => {
            if (commands.includes(value)) {
                commands = commands.replace(value, "").split(/\s+/)[0];
            };
        });

        const cmd = client.commands.get(commands) || client.aliases.get(commands);
        const args = message.content.substring(Prefix.some(x => x.length)).split(" ").splice(1);

        if (cmd) {
            if (!message.channel.permissionsFor(message.guild.members.me).has("SendMessages")) return;
            if (client.cooldowned.has(`${cmd.Name}-${message.author.id}`)) return;

            if (cmd.Category === "Root" && !client.system.ownerID.includes(message.author.id)) {
                return client.systemEmbed(message, message.translate("misc:OWNER_ONLY"))
            }

            if (message.guild) {
                let neededPermissions = [];
                if (cmd.Permissions && cmd.Permissions.Bot) cmd.Permissions.Bot.forEach((perm) => {
                    if (!message.channel.permissionsFor(client.user).has(perm)) {
						neededPermissions.push(perm);
					};
                });

                if (neededPermissions.length > 0) {
                    const perms = new PermissionsBitField();
                    neededPermissions.forEach((item) => perms.add(BigInt(item)));
                    client.logger.error(`Missing permission: \` ${perms.toArray().join(', ')} \` in [${message.guild.id}].`);
                    if (message.channel.permissionsFor(bot.user).has(PermissionsBitField.Flags.SendMessages)) {
                        if (message.deletable) message.delete();
                        return message.member.send({ content: message.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }) }).then(() => {
						}).catch(() => {
							return message.channel.send(message.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }));
						});
                    } else {
                        client.logger.error(`Missing permission: \`${neededPermissions.join(', ')}\` in [${message.guild.id}].`);
                        if (message.deletable) message.delete();
						return message.channel.send(message.translate('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') }));
                    }
                }

                neededPermissions = [];
                if (cmd.Permissions && cmd.Permissions.User) cmd.Permissions.User.forEach((perm) => {
					if (!message.channel.permissionsFor(message.member).has(perm)) {
						neededPermissions.push(perm);
					}
				});

                if (neededPermissions.length > 0) {
                    const perms = new PermissionsBitField();
					neededPermissions.forEach((item) => perms.add(BigInt(item)));
					if (message.deletable) message.delete();
                    return message.channel.error('misc:USER_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => message.translate(`permissions:${p}`)).join(', ') })
                }
            };

            if (client.cooldowns.has(`${cmd.Name}-${message.author.id}`)) {
                const lastTime = client.cooldowns.get(`${cmd.Name}-${message.author.id}`);
                const cooldownExpiration = lastTime + cmd.Cooldown * 1000;
                const cooldowned = Date.now() + cmd.Cooldown * 1000

                if (Date.now() < cooldownExpiration) {
                    client.systemEmbed(message, message.translate("misc:COOLDOWNED", { TIME: client.timestamp(cooldowned) }), cmd.Cooldown * 1000)
                    client.cooldowned.set(`${cmd.Name}-${message.author.id}`, Date.now());
                    setTimeout(() => { client.cooldowned.delete(`${cmd.Name}-${message.author.id}`); }, cmd.Cooldown * 1000);
                    return;
                }
            };

            try {
                await cmd.messageRun(client, message, args);
            } catch (ex) {
                client.systemEmbed(message, message.translate("misc:ERROR_MESSAGE", {err: ex}))
                client.logger.error("messageRun", {
                    error: ex,
                    guild: message.guild,
                    client: client,
                });
              } finally {
                client.commandsUsed++;
                if (cmd.Cooldown > 0) client.cooldowns.set(`${cmd.Name}-${message.author.id}`, Date.now());
                setTimeout(() => { client.cooldowns.delete(`${cmd.Name}-${message.author.id}`); }, cmd.Cooldown * 1000);
                client.logger.log(`Command: ${cmd.Name} was ran by ${message.author.tag}${!message.guild ? ' in DM\'s' : ` in guild: ${message.guild.name}`}.`);
            }
        };
    };
};
  
module.exports.config = {
    Event: Events.MessageCreate, System: true,
};