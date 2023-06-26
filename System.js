module.exports = {
    ServerID: "",
    Owners: [],
    MongooseURL: "",

    Functions: {    
        ShardingManager: {
            totalShards: 'auto',
            shardList: 'auto',
            shardArgs: ['--ansi', '--color'],
            mode: 'process',
            timeout: 87398,
            respawn: true,
        },

        Webhook: {
            Logger: true,
            Shards: "",
            Systems: "",
            Support: "",
            Console: ""
        },

        Presence: {
            Status: "",
            Type: "",
            Message: [],
        }
    },

    Client: {
        Token: "",
        Language: "",
        Prefix: []
    },
}