// Copyright (C) 2023 Brody Jagoe

const { sConfig } = require('../../database/dbObjects');
const { Sentry } = require('../../log');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		// Create default config for guild
		try {
			await sConfig.create({
				guild_id: guild.id,
				prefix: '>>',
			});
			console.log(`Default config made for ${guild.name}`);
		} catch(e) {
		// If server already had a config use the old one
			if (e.name === 'SequelizeUniqueConstraintError') {
				console.log(`Using old config for ${guild.name}`);
			}
			Sentry.captureException(e);
			// Send any other errors to console
			console.error(e);
		}
	},
};