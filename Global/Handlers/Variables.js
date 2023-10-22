const { Guild } = require('../Settings/Models/');
const logger = require('./Logger');

const databaseManager = {
    find: async function (databaseType, query) {
        try {
            switch (databaseType) {
                case 'Guild':
                    if (query) {
                        let guildResponse = await Guild.findOne(query);
                        if (!guildResponse) {
                            guildResponse = await Guild.create(query);
                        }

                        return guildResponse;
                    } else {
                        return await Guild.find({});
                    };

                default:
                    throw new Error(`Invalid database type: ${databaseType}`);
            }
        } catch (err) {
            logger.error(`find: ${databaseType} has error: ${err.message}`);
            throw err;
        }
    },

    update: async function (databaseType, query, update = {}) {
        try {
            if (!query) {
                throw new Error('Query parameter is required.');
            }

            switch (databaseType) {
                case 'Guild':
                    const settings = await Guild.updateOne(query, update, { upsert: true });
                    return settings;


                default:
                    throw new Error(`Invalid database type: ${databaseType}`);
            }
        } catch (err) {
            logger.error(`update: ${databaseType} has error: ${err.message}`);
            throw err;
        }
    },

    delete: async function (databaseType, query) {
        try {
            if (!query) {
                throw new Error('Query parameter is required.');
            }

            switch (databaseType) {
                case 'Guild':
                    const deletedGuild = await Guild.deleteOne(query);
                    return deletedGuild;

                default:
                    throw new Error(`Invalid database type: ${databaseType}`);
            }
        } catch (err) {
            logger.error(`delete: ${databaseType} has error: ${err.message}`);
            throw err;
        }
    },
};

module.exports = { databaseManager };
