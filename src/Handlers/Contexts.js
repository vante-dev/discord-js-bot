const { PermissionsBitField } = require("discord.js"), { Owners } = require("@root/System"), { Functions: { toDiscordTimestamp } } = require("@utils/vante");

module.exports = {
  Command: async function (client, interaction, context) {
    if (
      !interaction.channel
        .permissionsFor(interaction.guild.members.me)
        .has("SendMessages")
    )
      return;
    if (client.cooldowned.has(`${context}-${interaction.user.id}`)) return;

    if (client.cooldowns.has(`${context}-${interaction.user.id}`)) {
      const lastTime = client.cooldowns.get(
        `${context}-${interaction.user.id}`
      );
      const cooldownExpiration = lastTime + context.Cooldown * 1000;
      const cooldowned = Date.now() + context.Cooldown * 1000;

      if (Date.now() < cooldownExpiration) {
        const remainingTime = (cooldownExpiration - Date.now()) / 1000;
        client.embed(
          interaction,
          interaction.guild.translate("misc:COOLDOWN", {
            TIME: await toDiscordTimestamp(cooldowned),
          }),
          context.Cooldown * 1000
        );
        client.cooldowned.set(`${context}-${interaction.user.id}`, Date.now());
        setTimeout(() => {
          client.cooldowned.delete(`${context}-${interaction.user.id}`);
        }, context.Cooldown * 1000);
        return;
      }
    }

    if (interaction.guild) {
      let neededPermissions = [];
      if (context.Authory && context.Authory.Client) {
        context.Authory.Client.forEach((perm) => {
          if (
            [
              PermissionsBitField.Flags.Speak,
              PermissionsBitField.Flags.Connect,
            ].includes(perm)
          ) {
            if (!interaction.user.voice.channel) return;
            if (
              !interaction.user.voice.channel
                .permissionsFor(client.user)
                .has(perm)
            ) {
              neededPermissions.push(perm);
            }
          } else if (
            !interaction.channel.permissionsFor(client.user).has(perm)
          ) {
            neededPermissions.push(perm);
          }
        });
      }

      if (neededPermissions.length > 0) {
        const perms = new PermissionsBitField();
        neededPermissions.forEach((item) => perms.add(BigInt(item)));
        client.logger.error(
          `Missing permission: \`${perms.toArray().join(", ")}\` in [${
            interaction.guild.id
          }].`
        );
        return client.embed(
          interaction,
          interaction.translate("misc:MISSING_BOT_PERMS", {
            PERMISSIONS: perms
              .toArray()
              .map((p) => interaction.translate(`permissions:${p}`))
              .join(", "),
          })
        );
      }

      neededPermissions = [];
      if (context.Authory && context.Authory.User) {
        context.Authory.User.forEach((perm) => {
          if (!interaction.channel.permissionsFor(interaction.user).has(perm)) {
            neededPermissions.push(perm);
          }
        });
      }

      if (neededPermissions.length > 0) {
        const perms = new PermissionsBitField();
        neededPermissions.forEach((item) => perms.add(BigInt(item)));
        client.logger.error(
          `Missing permission: \`${perms.toArray().join(", ")}\` in [${
            interaction.guild.id
          }].`
        );
        return client.embed(
          interaction,
          interaction.translate("misc:USER_PERMISSION", {
            PERMISSIONS: perms
              .toArray()
              .map((p) => interaction.translate(`permissions:${p}`))
              .join(", "),
          })
        );
      }
    }

    try {
      await interaction.deferReply({ ephemeral: context.Ephemeral });
      await context.run(client, interaction);
    } catch (ex) {
      await client.embed(interaction, interaction.translate("misc:ERR_OCCURRED"));
      interaction.client.logger.error("contextRun", {
        error: ex,
        guild: interaction.guild,
        client: client,
      });
    } finally {
      client.commandsUsed++;
      if (context.Cooldown > 0)
        client.cooldowns.set(`${context}-${interaction.user.id}`, Date.now());
      setTimeout(() => {
        client.cooldowns.delete(`${context}-${interaction.user.id}`);
      }, context.Cooldown * 1000);
      client.logger.log(
        `Command: ${context.Name} was ran by ${interaction.user.tag}${
          !interaction.guild
            ? " in DM's"
            : ` in guild: ${interaction.guild.name}`
        }.`
      );
    }
  },
};
