
module.exports = {
    serverID: '',
    serverLink: '',
    ownerID: [],
    debug: false,

    Client: {
        Token: '',
        Prefix: [],

        Presence: {
            Status: '', // idle, online, dnd or offline
            Type: '', // PLAYING, STREAMING, LISTENING, COMPETING or WATCHING
            Message: [] // Messages that the bot displays in its presence status. 
            // {servers} = example output: 13k servers
            // {members} = example output: 150m members
        },

        Monitor: [
            { ID: 'System',    Webhook: '', },
            { ID: 'Servers',   Webhook: '', },
            { ID: 'Feedbacks', Webhook: '', },
            { ID: 'Bugs',      Webhook: '', },
        ],
    },
};