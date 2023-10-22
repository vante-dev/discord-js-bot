module.exports = {
    serverID: '',
    serverLink: 'https://discord.gg/luppux',
    ownerID: [''],
    premium: false,
    
    Bot: {
        Token: '',
        BotURL: '',
        Prefix: [],
        Language: 'en-US',
        
        Presence: {
            Status: 'idle', 
            Type: 'PLAYING', 
            Message: ['{servers} ⊹ {members}', 'Developed by Vante']
            // {servers} = example output: 13k servers
            // {members} = example output: 150m members
        },

        Monitor: [
            { ID: 'System',    Webhook: '', },
            { ID: 'Servers',   Webhook: '', },
            { ID: 'Feedbacks', Webhook: '', },
            { ID: 'Bugs',      Webhook: '', },
        ],
    }

}