module.exports = {
    serverID: '',
    ownerID: [''],
    mongoDB: '',

    Client: {
        Token: '',
        Language: 'en-US',
        Prefix: [''],

        Presence: {
            Status: "", // The bot's status [online, idle, dnd, invisible]
            Type: "", // Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
            Message: [], // Your bot status messages
        }
    },
    
    WebHooks: [ { ID: 'System',  URL: '' } ],
}