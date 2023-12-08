/*
	Copyright (C) 2023 Brody Jagoe

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
const loadEvents = require('./utils/eventLoader');
const loadCommands = require('./utils/commandLoader');

const Sentry = require('../log');
const { token } = require('../config.json');

const client = new Client({ intents: [
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessages,
], partials: [Partials.Channel] });

exports.Client = client;
client.commands = new Collection();

loadEvents(client);
loadCommands(client);

client.on('error', error => {
	client.users.cache.get('186493565445079040').send('An error occured - check the console.');
	Sentry.captureException(error);
	console.log(error);
	console.error();
});

process.on('unhandledRejection', error => {
	console.error(`Unhandled promise rejection: ${error}`);
	Sentry.captureException(error);
});

process.on('uncaughtException', error => {
	console.error(`Uncaught exception: ${error}`);
	Sentry.captureException(error);
});


client.login(token);