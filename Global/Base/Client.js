const { Client, Partials, GatewayIntentBits, Collection, ApplicationCommandType } = require("discord.js");
const { validateCommand, validateContext } = require("../Helpers/Validator");
const FileManager = require("../Helpers/File");
const BotDatabase = require("./Database");

class VanteClient extends Client {
    constructor(options) {
        super({
            partials: Object.keys(Partials),
            intents: Object.keys(GatewayIntentBits),
        });

        this.Vante = options;
        this.commands = new Collection();
        this.aliases = new Collection();
        this.slashCommands = new Collection();
        this.contextMenus = new Collection();
        this.cooldowns = new Collection();

        this.languages = require(`${__dirname}/../Languages/language-meta.json`);
        this.system = (global.system = require(`../System`));
        this.logger = (global.logger = require("../Helpers/Logger"));
        this.emoji = (global.emoji = require("../Database/Emoji.json"))

        require("../Helpers");
    };

    /**
    * Spawns and initializes the application.
    */
    async spawn() {
        this.logger.success(`Spawns shards and initializes the application.`);
        this.database = new BotDatabase({ Folder: 'Global/Database', UpdateCheck: false, Client: this });
        let success = 0, error = 0;

        const Events = new FileManager({
            Folder: 'Events',
            Type: 'Event',
            Load: true
        });

        const Commands = new FileManager({
            Folder: 'Commands',
            Type: 'Command',
            Load: this.Vante.Commands || false
        });

        const Contexts = new FileManager({
            Folder: 'Contexts',
            Type: 'Context',
            Load: this.Vante.Contexts || false

        });

        for (const file of Events.filePaths) {
            try {
                const event = require(file);
                if (!event.config.Development) {
                  this.on(event.config.Event, event.bind(null, this));
                  delete require.cache[require.resolve(file)];
                  success += 1;
                }
            } catch (ex) {
                error += 1;
                this.logger.error(`loadEvent ( ${file} ) - ${ex}`);
            };
        };

        for (const file of Commands.filePaths) {
            try {
                const data = require(file);
                if (typeof data !== "object") continue;
                if (data.onLoad != undefined && typeof data.onLoad == "function") data.onLoad(this);

                const valid = validateCommand(data);

                if (valid) {
                    if (data.Command.Prefix) {
                        if (this.commands.has(data.Name)) {
                            throw new Error(`Command "${data.Name}" already registered`);
                        };

                        if (Array.isArray(data.Aliases)) {
                            data.Aliases.forEach((alias) => {
                                if (this.aliases.has(alias))  throw new Error(`Alias ${alias} already registered`);
                                this.aliases.set(alias, data);
                            });
                        };

                        this.commands.set(data.Name, data);
                    };

                    if (data.Command.Slash) {
                        if (this.slashCommands.has(data.Name)) throw new Error(`Slash Command "${data.Name}" already registered`);
                        this.slashCommands.set(data.Name, data);
                    };
                }; 
            } catch (error) {
                this.logger.error(`Failed to load ${file} Reason: ${error.message}`);
            };
        };

        for (const file of Contexts.filePaths) {
            try {
                const data = require(file);
                if (typeof data !== "object") continue;

                const valid = validateContext(data);
                if (valid) {
                    if (data.Enabled) {
                        if (this.contextMenus.has(data.Name)) throw new Error(`Context already exists with that name`);
                        this.contextMenus.set(data.Name, data);
                    };
                };
            } catch (error) {
                this.logger.error(`Failed to load ${file} Reason: ${error.message}`);
            };
        };


        this.logger.success(`Loaded ${this.commands.size + this.slashCommands.size + this.contextMenus.size} commands (Prefix: ${this.commands.size} Slash: ${this.slashCommands.size} Context: ${this.contextMenus.size})`);
        this.logger.success(`Loaded ${success + error} events. Success (${success}) Failed (${error})`);

        if (this.slashCommands.size > 100) this.logger.error("A maximum of 100 slash commands can be enabled");

        this.login(this.Vante.Token).then(app => {
            this.on('ready', async (client) => {

                client.translations = await require('../Helpers/Language')();
                
                if (this.Vante.Commands || this.Vante.Contexts) {
                    const interactionToRegister = [];

                    const { run } = require('../Helpers/Languages');

                    const ConvertSlashCommands = Promise.all(this.slashCommands.map(async (cmd) => {
                        const [name_localizations, description_localizations] = await Promise.all([
                            run(client, cmd.Name),
                            run(client, cmd.Description, true)
                        ]);

                        return {
                            name: cmd.Name,
                            description: cmd.Description,
                            description_localizations: description_localizations ?? {},
                            type: ApplicationCommandType.ChatInput,
                            options: cmd.Command.Options,
                        };
                    }));
                    
                    const ConvertContextMenus = Promise.all(this.contextMenus.map(async (cmd) => {
                        const name_localizations = await run(client, cmd.Name, true);
                    
                        return {
                            name: cmd.Name,
                            name_localizations: name_localizations ?? {},
                            type: cmd.Type,
                        };
                    }));
                    
                    const [slashCommandsResult, contextMenusResult] = await Promise.all([ConvertSlashCommands, ConvertContextMenus]);

                    interactionToRegister.push(...slashCommandsResult);
                    interactionToRegister.push(...contextMenusResult);


                    await this.application.commands.set(interactionToRegister);
                };

                this.logger.loaded(this);
                this.logger.line();
            });
        });        
    };
};

module.exports = { VanteClient };