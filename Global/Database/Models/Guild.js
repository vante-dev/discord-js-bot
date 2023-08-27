const { Schema, model } = require('mongoose');
const { Client } = require("../../System");

const guildSchema = Schema({
	guildID: String,
	guildName: String,
	prefix: { type: Array, default: Client.Prefix },
	language: { type: String, default: Client.Language },
});

module.exports = model('Guild', guildSchema);