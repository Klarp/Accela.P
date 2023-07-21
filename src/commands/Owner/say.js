// Copyright (C) 2023 Brody Jagoe

const { Client } = require('../../index');

module.exports = {
	name: 'say',
	description: 'Say something in the osu server',
	module: 'Owner',
	owner: true,
	async execute(message, args) {
		const channels = {
			'-g': '98226572468690944',
			'-w': '158484765136125952',
			'-osu': '98227800330227712',
			'-off': '158481913055674368',
			'-m': '739447503115649054',
			'-b': '277163440999628800',
		};

		const channelId = channels[args[0]];
		if (!channelId || !args[1]) return;

		const argMessage = args.slice(1).join(' ');
		try {
			await Client.guilds.cache.get('98226572468690944').channels.cache.get(channelId).send(argMessage);
		} catch (error) {
			console.error(`Error sending message: ${error}`);
		}
	},
};
