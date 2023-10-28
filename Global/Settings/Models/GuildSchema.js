const vanteDB = require('vantedb');
const { Bot } = require('../Config');

const guildSchema = {
    guildID: String,
    guildName: String,
    Prefix: { type: Array, default: Bot.Prefix },
    Language: { type: String, default: Bot.Language },
    News: { type: String, default: "" },
    NewsData: { type: Number, default: 0 },
};

module.exports = vanteDB.model({
    Collection: 'Servers',
    Folder: './Global/Database/',
    Cluster: false,
    Type: [],
}, guildSchema);