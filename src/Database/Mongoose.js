const mongoose = require('mongoose');

module.exports = {
	start: (client) => {
		const dbOptions = {
			useNewUrlParser: true,
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
			useUnifiedTopology: true,
		};
		mongoose.connect(client.system.MongooseURL, dbOptions);
		mongoose.Promise = global.Promise;
		mongoose.connection.on('connected', () => {
			client.logger.debug('MongoDB successfully connected');
		});
		mongoose.connection.on('err', (err) => {
			client.logger.error(`MongoDB has encountered an error: \n ${err.stack}`);
		});
		mongoose.connection.on('disconnected', () => {
			client.logger.error('MongoDB disconnected');
		});
	},
	async ping() {
		const currentNano = process.hrtime();
		await mongoose.connection.db.command({ ping: 1 });
		const time = process.hrtime(currentNano);
		return (time[0] * 1e9 + time[1]) * 1e-6;
	},
};