const Sentry = require('../../log');
const fs = require('fs');

module.exports = (client) => {
	const modules = ['osu', 'Fun', 'Utility', 'Owner'];

	modules.forEach(c => {
		const commandPath = `../src/commands/${c}`;
		console.log(`[Command Logs] Loading commands of module ${c}`);
		console.log(`[Command Logs] Loading commands from: ${commandPath}`);
		fs.readdir(`../src/commands/${c}`, (err, files) => {
			if (err) {
				Sentry.captureException(err);
				throw err;
			}

			files.forEach(f => {
				const props = require(`../commands/${c}/${f}`);

				client.commands.set(props.name, props);
			});

			console.log(`[Command Logs] Loaded ${files.length} commands of module ${c}`);
		});
	});
};