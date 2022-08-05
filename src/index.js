/*
	Copyright (C) 2022 Brody Jagoe

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, GNU GPLv3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
	along with this program. If not, see <https://www.gnu.org/licenses/>.

	Contact: AccelaHelp@gmail.com
*/

// Special thanks to all those helped me with Accela such as Stedoss, uyitroa, ek and Phil.

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const Sentry = require('../log');
const { token } = require('../config.json');

const client = new Client({ intents: [
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildBans,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessages,
], partials: [Partials.Channel] });

client.commands = new Collection();
exports.Client = client;

const modules = ['osu!', 'Fun', 'Utility', 'Owner'];

client.on('error', error => {
	client.users.cache.get('186493565445079040').send('An error occured - check the console.');
	Sentry.captureException(error);
	console.log(error);
	console.error();
});

// START EVENT LOADING

const eventPath = path.join(__dirname, 'events');
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

// START COMMAND LOADING

modules.forEach(c => {
	fs.readdir(`./commands/${c}`, (err, files) => {
		if (err) {
			Sentry.captureException(err);
			throw err;
		}

		files.forEach(f => {
			const props = require(`./commands/${c}/${f}`);

			client.commands.set(props.name, props);
		});

		console.log(`[Command Logs] Loaded ${files.length} commands of module ${c}`);
	});
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
	Sentry.captureException(error);
});


client.login(token);