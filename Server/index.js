(async () => {
    const { VanteClient } = require("../Global/Base/Client");
    const { Client } = require("../Global/System");
    
    const client = global.client = new VanteClient({   
        Token: Client.Token,
        Prefix: Client.Prefix,
        Language: 'en-US',

        Commands: true,
        Contexts: true,
    });

    client.spawn('website', 'https://vante.dev/');
})();