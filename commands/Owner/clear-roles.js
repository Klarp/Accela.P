// Copyright (C) 2022 Brody Jagoe

// Unfinished till update is fixed

const { Client } = require('../../index');
const { Users } = require('../../dbObjects');

module.exports = {
	name: 'clear-roles',
	aliases: ['clearroles', 'clear'],
	description: 'Clears roles from non-verified users',
	module: 'Owner',
	owner: true,
	cooldown: 5,
	async execute() {
		const osuUsers = await Users.findAll();
		const osuGame = Client.guilds.cache.get('98226572468690944');
		// const logChannel = osuGame.channels.cache.get('776522946872344586');
		const osuMembers = osuGame.members.cache;

		osuUsers
			.filter(user => user.verified_id !== null)
			.filter(user => Client.users.cache.has(user.user_id));

		osuMembers.forEach(member => {
			console.log(member.user.tag);
		});
	},
};