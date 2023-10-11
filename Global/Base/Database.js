const { Database } = require("vantedb");

class BotDatabase extends Database {
    constructor(options = { Folder: 'VanteDB', UpdateCheck: true, Client: undefined }) {
        super(options);

        this.model('Guild', {
            guildID: { Type: 'String', Default: "" },
            guildName: { Type: 'String', Default: "" },
            Prefix: { Type: 'Array', Default: options.Client.system.Client.Prefix },
            Language: { Type: 'String', Default: options.Client.Vante.Language }
        });

        this.model('Vante', {
            clientID:  { Type: 'String', Default: "" },
            news: { Type: 'String', Default: "" },
            time: { Type: 'String', Default: "" },
            Users: { Type: 'Array', Default: [] },
            Servers: { Type: 'Array', Default: [] },
        });

        options.Client.logger.success('All models loaded and defined.');
    };
}

module.exports = BotDatabase;
