(async () => {
    const { VanteClient } = require('../Global/Base/Client');
    const { Bot } = require('../Global/Settings/Config');
    
    const client = global.client = new VanteClient({   
        Token: Bot.Token,
        Prefix: Bot.Prefix,
        Language: Bot.Language,
        Webhooks: Bot.Monitor,
        
        Debugger: false,
        Commands: true,
        Contexts: true,
    });

    await client.spawn('website', 'https://vante.dev/');
})();