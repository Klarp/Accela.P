// Copyright (C) 2023 Brody Jagoe

const osu = require('node-osu');
const Sentry = require('../../../log');
const { Users } = require('../../../database/dbObjects');
const { osu_key } = require('../../../config.json');

async function createUser(message, osuName, osuID) {
	await Users.create({
		user_id: message.author.id,
		osu_name: osuName,
		osu_id: osuID,
	});
	return message.channel.send(`Linked ${message.author} to ${osuName} (osu! ID: ${osuID})`);
}

async function updateUser(message, osuName, osuID) {
	const [updateCount] = await Users.update({
		osu_name: osuName,
		osu_id: osuID,
	},
	{
		where: { user_id: message.author.id },
	});

	if (updateCount > 0) {
		return message.reply(`Updated link to ${osuName} (osu! ID: ${osuID})`);
	}

	throw new Error('Could not find a link to update!');
}

module.exports = {
	name: 'link',
	description: 'Links osu! account for use with osu! commands',
	module: 'Osu!',
	usage: '<user>',
	args: true,
	async execute(message, args) {
		const osuApi = new osu.Api(osu_key);
		const user = args.join(' ').replace(/[^\w\s]/gi, '');

		if (user === '') return message.reply('Error: No special characters allowed!');

		try {
			const u = await osuApi.getUser({ u: user });
			try {
				await createUser(message, u.name, u.id);
			} catch(e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					await updateUser(message, u.name, u.id);
				} else {
					Sentry.captureException(e);
					console.error(e);
					return message.reply('Error: An unexpected error occurred while linking the osu! account.');
				}
			}
		} catch (e) {
			Sentry.captureException(e);
			console.error(e);
			return message.reply('Error: Failed to fetch user from osu! API.');
		}
	},
};
