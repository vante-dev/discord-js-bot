const { Client, Collection, GatewayIntentBits, Partials, WebhookClient, ApplicationCommandType, EmbedBuilder, ActivityType } = require("discord.js");
const { VanteLoader } = require("vante.ai"), Guild = require("@schemas/Guild");
const { validateCommand, validateContext } = require("@helpers/Validator");

class VanteClient extends Client {
    constructor(Vante) {
        super({
            partials: Object.keys(Partials),
            intents: Object.keys(GatewayIntentBits),
        });

        this.Vante = Vante;
        this.commands = new Collection();
        this.slashcommands = new Collection();
        this.contextcommands = new Collection();
        this.cooldowns = new Collection();
        this.cooldowned = new Collection();
        this.aliases = new Collection();
        this.Tables = [];

        this.mongoose = require('@database/Mongoose');
        this.languages = require(`${__dirname}/../Languages/language-meta.json`);
        this.system = (global.System = require(`${__dirname}/../../System`));

        this.shardLogs = (global.shardLogs = this.system.Functions.Webhook.Shards ? new WebhookClient({ url: this.system.Functions.Webhook.Shards }) : undefined);
        this.errorLogs = (global.errorLogs = this.system.Functions.Webhook.System ? new WebhookClient({ url: this.system.Functions.Webhook.System }) : undefined);
        this.supportLogs = (global.supportLogs = this.system.Functions.Webhook.Support ? new WebhookClient({ url: this.system.Functions.Webhook.Support }) : undefined);

        this.logger = global.logger = require("../Helpers/Utils/Logger");
        this.messagesSent = 0;
        this.commandsUsed = 0;
    };

    async deleteGuild(guild) {
        try {
            await Guild.findOneAndRemove({ guildID: guild.id });
            return true;
        } catch (err) {
            this.logger.error(err.message);
            return false;
        }
    };

    async translate(key, args, locale) {
        if (!locale) locale = this.system.Client.Language;
        const language = this.translations.get(locale);
        if (!language) return 'Invalid language set in data.';
        return language(key, args);
    };

    async embed(interaction, data, cooldown) {
        const embed = new EmbedBuilder().setColor(this.system.Settings.Color).setDescription(`>>> ${data.substring(0, 3000)}`);
        if(!cooldown) {
          if (interaction.deferred) {
            interaction.followUp({ embeds: [embed], ephemeral: true }).then(x => {
              setTimeout(() => {
                x.delete().catch(err => {})
              }, 15 * 1000);
            }).catch((e) => {});
          } else {
            interaction.reply({ embeds: [embed], ephemeral: true }).then(x => {
              setTimeout(() => {
                x.delete().catch(err => {})
              }, 15 * 1000);
            }).catch((e) => {});
          }
        } else {
          if (interaction.deferred) {
            interaction.followUp({ embeds: [embed], ephemeral: true }).then(x => {
              setTimeout(() => {
                x.delete().catch(err => {})
              }, cooldown);
            }).catch((e) => {});
          } else {
            interaction.reply({ embeds: [embed], ephemeral: true }).then(x => {
              setTimeout(() => {
                x.delete().catch(err => {})
              }, cooldown);
            }).catch((e) => {});
          }
        }
    };

    async spawn(token, vante) {
      this.logger.debug(`Starting shards and loading commands and events...`);
      let success = 0;
      let failed = 0;

      const Events = await VanteLoader("src/events");
      for (const file of Events) {
        try {
          const event = require(file);
          if(event.config.System) {
            this.on(event.config.Event, event.bind(null, this));
            delete require.cache[require.resolve(file)];
            success += 1; 
          } 
        } catch (ex) {
          failed += 1;
          this.logger.error(`loadEvent ( ${file} ) - ${ex}`);
        }
      };

      this.logger.debug(`Loaded ${success + failed} events. Success (${success}) Failed (${failed})`);

      const Commands = await VanteLoader("src/commands");
      for (const file of Commands) {
        try {
          const cmd = require(file);
          if (typeof cmd !== "object") continue;
          if(cmd.onLoad != undefined && typeof cmd.onLoad == "function") cmd.onLoad(this);
          validateCommand(cmd);

          if (cmd.Command?.Prefix) {
            if (this.commands.has(cmd.Name)) {
              throw new Error(`Command ${cmd.Name} already registered`);
            }

            if (Array.isArray(cmd.Aliases)) {
              cmd.Aliases.forEach((alias) => {
                if (this.aliases.has(alias)) throw new Error(`Alias ${alias} already registered`);
                this.aliases.set(alias, cmd)
              });
            }

            this.commands.set(cmd.Name, cmd);
          }

          if (cmd.Command?.Slash) {
            if (this.slashcommands.has(cmd.Name)) throw new Error(`Slash Command ${cmd.Name} already registered`);
            this.slashcommands.set(cmd.Name, cmd);
          }
        } catch (ex) {
          this.logger.error(`Failed to load ${file} Reason: ${ex.message}`);
        }
      };

      const Contexts = await VanteLoader("src/contexts");
      for (const file of Contexts) {
        try {
          const ctx = require(file);
          if (typeof ctx !== "object") continue;
          validateContext(ctx);
          if (ctx.Enabled) {
            if (this.contextcommands.has(ctx.Name)) throw new Error(`Context already exists with that name`);
            this.contextcommands.set(ctx.Name, ctx);
          }
        } catch (ex) {
          this.logger.error(`Failed to load ${file} Reason: ${ex.message}`);
        }
      };

      this.logger.debug(`Loaded ${this.commands.size + this.contextcommands.size} commands (Prefix: ${this.commands.size} Slash: ${this.slashcommands.size} Context: ${this.contextcommands.size})`);
      if (this.slashcommands.size > 100) this.logger.error("A maximum of 100 slash commands can be enabled");

      await this.mongoose.start(this);

      this.login(this.Vante.Client.Token).then(kaanxsrd => {
        this.on("ready", async (client) => {
          if (this.Vante.Client.Commands || this.Vante.Client.Contexts) {
            const toRegister = [];

              this.slashcommands.map((cmd) => ({
                  name: cmd.Name,
                  description: cmd.Description,
                  type: ApplicationCommandType.ChatInput,
                  options: cmd.Command.Options,
              })).forEach((s) => toRegister.push(s));

              this.contextcommands.map((ctx) => ({
                  name: ctx.Name,
                  type: ctx.Type,
              })).forEach((c) => toRegister.push(c));

              await this.application.commands.set(toRegister);
              this.logger.debug("Successfully registered interactions");
              this.logger.debug(this.user.tag)

              this.Tables.push(["Events", success]);
              this.Tables.push(["Commands", this.commands.size + this.slashcommands.size + this.contextcommands.size]);
              this.Tables.push(["Prefix", this.commands.size]);
              this.Tables.push(["Slash", this.slashcommands.size]);
              this.Tables.push(["Context", this.contextcommands.size]);
              this.logger.log("―――――――――――――――――――――――――――――――――――――――――――――――――")
          };
          const getType = (type) => {
            switch (type) {
              case "COMPETING":
                return ActivityType.Competing;
        
              case "LISTENING":
                return ActivityType.Listening;
        
              case "PLAYING":
                return ActivityType.Playing;
        
              case "WATCHING":
                return ActivityType.Watching;

              case "STREAMING":
                return ActivityType.Streaming;
            }
          };

          setInterval(async () => {
            client.user.setPresence({
              status: client.system.Functions.Presence.Status,
              activities: [
                {
                  name: client.system.Functions.Presence.Message[Math.floor(Math.random() * client.system.Functions.Presence.Message.length)],
                  type: getType(client.system.Functions.Presence.Type),
                  url: "https://www.twitch.tv/vantexsrd"
                },
              ],
            });
          }, 10000);


        });
      });
    };
};

module.exports = { VanteClient }
