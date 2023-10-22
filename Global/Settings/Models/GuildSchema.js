const vanteDB = require('vantedb');
const { Bot } = require('../Config');

const guildSchema = {
    guildID: String,
    guildName: String,
    Prefix: { type: Array, default: Bot.Prefix },
    Language: { type: String, default: Bot.Language },
    Client: { 
        type: Object, 
        default: {
            News: '',
            Time: ''
        } 
    }
};

module.exports = vanteDB.model('Guild', guildSchema);