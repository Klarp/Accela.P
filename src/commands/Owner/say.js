// Copyright (C) 2023 Brody Jagoe
/* eslint-disable no-undef */

const { Client } = require('../../index');

module.exports = {
	name: 'say',
	description: 'Say something in the osu server',
	module: 'Owner',
	owner: true,
	execute(message, args) {
		if (args[0] === '-g') {
			if (args[1]) {
				const argMessage = args.slice(1).join(' ');
				Client.guilds.cache.get('98226572468690944').channels.cache.get('98226572468690944').send(argMessage);
			}
		}

		if (args[0] === '-w') {
			if (args[1]) {
				const argMessage = args.slice(1).join(' ');
				Client.guilds.cache.get('98226572468690944').channels.cache.get('158484765136125952').send(argMessage);
			}
		}

		if (args[0] === '-osu') {
			if (args[1]) {
				const argMessage = args.slice(1).join(' ');
				Client.guilds.cache.get('98226572468690944').channels.cache.get('98227800330227712').send(argMessage);
			}
		}

		if (args[0] === '-off') {
			if (args[1]) {
				const argMessage = args.slice(1).join(' ');
				Client.guilds.cache.get('98226572468690944').channels.cache.get('158481913055674368').send(argMessage);
			}
		}

		if (args[0] === '-m') {
			if (args[1]) {
				const argMessage = args.slice(1).join(' ');
				Client.guilds.cache.get('98226572468690944').channels.cache.get('739447503115649054').send(argMessage);
			}
		}

		if (args[0] === '-b') {
			if (args[1]) {
				const argMessage = args.slice(1).join(' ');
				Client.guilds.cache.get('98226572468690944').channels.cache.get('277163440999628800').send(argMessage);
			}
		}
	},
};