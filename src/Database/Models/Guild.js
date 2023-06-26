const { Schema, model } = require('mongoose');
const { Client } = require("@root/System"); 

const guildSchema = Schema({
	guildID: String,
	guildName: String,
	Prefix: { type: Array, default: Client.Prefix },
	Language: { type: String, default: Client.Language },
});

module.exports = model('Guild', guildSchema);