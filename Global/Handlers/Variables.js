const { Guild } = require('../Settings/Models/');
const logger = require('../Helpers/Logger');

const databaseManager = {
    find: async function (databaseType, query) {
        try {
            switch (databaseType) {
                case 'Guild':
                    if (query) {
                        let response = await Guild.findOne(query);
                        if (!response) {
                            response = await Guild.create(query);
                        }

                        return response;
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
                    return await Guild.updateOne(query, update, { upsert: true });
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
                    return await Guild.deleteOne(query);
                default:
                    throw new Error(`Invalid database type: ${databaseType}`);
            }
        } catch (err) {
            logger.error(`delete: ${databaseType} has error: ${err.message}`);
            throw err;
        }
    },
};

module.exports = databaseManager;