const { ActivityType, Client, Collection, GatewayIntentBits, Partials, PermissionsBitField: { Flags: PermissionFlag }, ApplicationCommandType } = require('discord.js');
const { Client: { fileLoader, validateCommand, validateContext} } = require("../Helpers");

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

    this.mongoose = require('../Database/Mongoose');
    this.languages = require(`${__dirname}/../Languages/language-meta.json`);
    this.logger = global.logger = require("../Helpers/Extras/Logger");
    this.system = (global.system = require(`../System`));

    require("../Prototypes");
    require("../Helpers/Extras/Fonts");

    this.messagesSent = 0;
		this.commandsUsed = 0;
    this.success = 0;
    this.failed = 0;
  }

  /**
  * Execute a function in a loop with a specified delay.
  * @param {Function} fn - The function to be executed in the loop.
  * @param {number} delay - The delay between each execution of the function, in milliseconds.
  * @param {...*} param - Additional parameters to pass to the function.
  * @returns {number} The interval ID that can be used to clear the loop using `clearInterval`.
  */
  async loop(fn, delay, ...param) {
		fn();
		return setInterval(fn, delay, ...param);
	};

  /**
  * Spawns and initializes the application.
  * @param {boolean} [prefix=true] - Whether to enable prefix commands.
  * @param {boolean} [slash=true] - Whether to enable slash commands.
  * @param {boolean} [context=true] - Whether to enable context menu commands.
  * @param {boolean} [database=true] - Whether to connect to the database.
  * @returns {void}
  */3
  async spawn(prefix = true, slash = true, context = true, database = true) {

    this.logger.success(`Starting shards and loading commands and events...`);

    const Events = fileLoader("Server/Events");
    for (const file of Events) {
      try {
        const event = require(file);
        if(event.config.System) {
          this.on(event.config.Event, event.bind(null, this));
          delete require.cache[require.resolve(file)];
          this.success += 1; 
        } 
      } catch (ex) {
        this.failed += 1;
        this.logger.error(`loadEvent ( ${file} ) - ${ex}`);
      }
    };


    const Commands = fileLoader("Server/Commands");
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

    const Contexts = fileLoader("Server/Contexts");
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

    this.mongoose.init(this);

    this.logger.success(`Loaded ${this.commands.size + this.contextcommands.size} commands (Prefix: ${this.commands.size} Slash: ${this.slashcommands.size} Context: ${this.contextcommands.size})`);
    this.logger.success(`Loaded ${this.success + this.failed} events. Success (${this.success}) Failed (${this.failed})`);
    if (this.slashcommands.size > 100) this.logger.error("A maximum of 100 slash commands can be enabled");

    this.login(this.Vante.Token).then(kaanxsrd => {

      this.on("ready", async (client) => {
        if (this.Vante.Commands || this.Vante.Contexts) {
          const inreractionToRegister = [];

          client.translations = await require('../Helpers/Extras/Language')();

          this.slashcommands.map((cmd) => ({
            name: cmd.Name,
            description: cmd.Description,
            type: ApplicationCommandType.ChatInput,
            options: cmd.Command.Options,
          })).forEach((s) => inreractionToRegister.push(s));

          this.contextcommands.map((ctx) => ({
            name: ctx.Name,
            type: ctx.Type,
        })).forEach((c) => inreractionToRegister.push(c));

          
        this.logger.loaded(this);
        this.delay(1000)
        this.logger.line()
        }
      });
    });

  }
};

module.exports = { VanteClient }