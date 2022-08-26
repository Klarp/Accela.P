const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'osuUsers.sqlite',
});

const serverConfig = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'serverConfig.sqlite',
});

require('./models/Users.js')(sequelize, Sequelize);
require('./models/Config.js')(serverConfig, Sequelize);

const forceNew = process.argv.includes('--force') || process.argv.includes('-f');
const osu = process.argv.includes('--osu') || process.argv.includes('-o');

syncData();

function syncData() {
	sequelize.sync({ force: forceNew }).then(async () => {
		console.log('osu! users synced');
		sequelize.close();
	}).catch(console.error);

	if (osu) return;

	serverConfig.sync({ force: forceNew }).then(async () => {
		console.log('Server config synced');
		serverConfig.close();
	}).catch(console.error);
}

