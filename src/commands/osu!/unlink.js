// Copyright (C) 2023 Brody Jagoe

const Sentry = require('../../../log');
const { Client } = require('../../index');
const { Users } = require('../../../database/dbObjects');
const { roleList } = require('../../../config.json');

module.exports = {
	name: 'unlink',
	description: 'Unlinks osu! account',
	module: 'Osu!',
	async execute(message) {
		try {
			const unLink = await Users.destroy({ where: { user_id: message.author.id } });
			if (!unLink) return message.reply('No link found!');

			const osuGame = Client.guilds.cache.get('98226572468690944');
			const member = osuGame.members.cache.get(message.author.id);

			if (member) {
				for (const role of roleList) {
					if (member.roles.cache.has(role)) {
						member.roles.remove(role);
					}
				}
			}

			return message.reply('Successfully unlinked!');
		} catch (e) {
			Sentry.captureException(e);
			console.error(e);
			return message.reply('An error has occurred');
		}
	},
};