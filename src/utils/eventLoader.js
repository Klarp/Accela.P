const fs = require('fs');
const path = require('path');

module.exports = (client) => {
	const eventPath = path.join(__dirname, '..', 'events');
	const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventPath, file);
		const event = require(filePath);
		console.log(`[Event Logs] Loaded ${event.name} event`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
};