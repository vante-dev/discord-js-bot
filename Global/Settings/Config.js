module.exports = {
    serverID: '',
    ownerID: [],
    
    Bot: {
        Token: '',
        Prefix: [],
        Language: '',
        
        Presence: {
            Status: '', 
            Type: '', 
            Message: []
        },

        Monitor: [
            { ID: 'System',    Webhook: '', },
            { ID: 'Servers',   Webhook: '', },
            { ID: 'Feedbacks', Webhook: '', },
            { ID: 'Bugs',      Webhook: '', },
        ],

        Links: {
            SupportServer: 'https://discord.gg/luppux',
            Dashboard: 'https://vante.dev/',
            Invite: 'https://discord.com/api/oauth2/authorize?client_id=0&permissions=8&scope=bot%20applications.commands',
            Vote: 'https://vante.dev/vote'
        }
    }
};