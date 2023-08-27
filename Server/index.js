(async () => {
    const { VanteClient } = require("../Global/Base/Client");
    const Settings = require("../Global/System");

    const client = global.client = new VanteClient({   
        Token: Settings.Client.Token,
        Prefix: Settings.Client.Prefix,
        Language: Settings.Client.Language,

        Commands: true,
        Contexts: true,
        Events: true,
    });

    client.spawn();
})();