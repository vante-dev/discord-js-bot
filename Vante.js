require("folder-connect/vante");
require("@extenders/vante");

(async () => {
    const { VanteClient } = require("@client/Vante");
    const VanteSettings = require("@root/System");

    const client = global.client = new VanteClient({ 
        CheckForUpdates: true,
        MongooseConnect: true,  

        Client: {
            Token: VanteSettings.Client.Token,
            Prefix: VanteSettings.Client.Prefix,
            Language: VanteSettings.Client.Language,

            Commands: true,
            Contexts: true,
            Events: true,
        }
    });

    client.translations = await require('@helpers/Language')();
    client.spawn({ Author: "vante#1337", Community: "discord.gg/testers" });
})();