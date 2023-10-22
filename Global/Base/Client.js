const { Client, Partials, GatewayIntentBits, Collection, ApplicationCommandType, ButtonStyle} = require('discord.js');
const { Validator: { Command, Context }, FileManager } = require('../Handlers');
const { databaseManager } = require('../Handlers/Variables');
const { GiveawaysManager } = require("vante-giveaways");


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
        this.premium = new Collection();

        this.languages = require(`../Languages/language-meta.json`);
        this.system = (global.system = require(`../Settings/Config`));
        this.logger = (global.logger = require('../Handlers/Logger'));
        this.emoji = (global.emoji = require('../Settings/Emoji.json'));
        this.giveawaysManager = new GiveawaysManager(this, { 
            storage: './Database/Giveaways.json',
            default: {
                botsCanWin: true,
                embedColor: '#0a0000',
                buttonEmoji: this.emoji.tada,
                buttonStyle: ButtonStyle.Secondary,
            }
          }); 
        this.database = databaseManager;

        require('../Helpers');
    };

    async spawn() {
        this.logger.success(`Spawns shards and initializes the application.`);
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
                if (typeof data !== 'object') continue;

                const valid = Command(data);

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
                if (typeof data !== 'object') continue;

                const valid = Context(data);
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

        if (this.slashCommands.size > 100) this.logger.error('A maximum of 100 slash commands can be enabled');

        return super.login(this.Vante.Token).then(app => {
            this.on('ready', async (client) => {

                client.giveawaysManager.on('giveawayJoined', (giveaway, member, interaction) => {
                    interaction.reply({ content: interaction.translate("giveaway:GIVEAWAY_JOINED", { EMOJI: this.emoji.tada, USER: member.user.username }), ephemeral: true })
                });
                  
                client.giveawaysManager.on('giveawayLeaved', (giveaway, member, interaction) => {
                    interaction.reply({ content: interaction.translate("giveaway:GIVEAWAY_LEAVED", { EMOJI: this.emoji.tada, USER: member.user.username }), ephemeral: true })
                });

                client.translations = await require('../Handlers/Language')();
                
                if (this.Vante.Commands || this.Vante.Contexts) {
                    const interactionToRegister = [];
                
                    this.slashCommands.forEach((cmd) => {
                        interactionToRegister.push({
                            name: cmd.Name,
                            description: cmd.Description,
                            type: ApplicationCommandType.ChatInput,
                            options: cmd.Command.Options,
                        });
                    });
                
                    this.contextMenus.forEach((cmd) => {
                        interactionToRegister.push({
                            name: cmd.Name,
                            type: cmd.Type,
                        });
                    });
                
                    await this.application.commands.set(interactionToRegister);
                }

                this.logger.loaded(this);
                this.logger.line();
            });
        });        
    };
};

module.exports = { VanteClient };