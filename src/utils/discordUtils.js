// Copyright (C) 2023 Brody Jagoe

const { ChannelType } = require('discord.js');
const { ranks, roleIds } = require('./ranks');

module.exports = {
	// Check user permissions
	hasPermission: (user, perm, message) => {
		return message.channel.type === ChannelType.DM || user.permissions.has(perm);
	},

	// Get role based on rank
	updateRankRole: async (member, rank, mode) => {
		if (rank === 0 || rank === null || rank === undefined) {
			const maxRole = roleIds[mode][roleIds[mode].length - 1];
			console.log(maxRole);
			if (!maxRole) {
				console.error(`No max role found for mode ${mode}.`);
				return;
			}
			return member.roles.add(maxRole);
		}

		const roleIndex = ranks[mode].findIndex(r => rank < r);

		// Check if rank is greater than any rank in the ranks array
		if (roleIndex === -1) {
			const maxRole = roleIds[mode][roleIds[mode].length - 1];
			console.log(`Rank ${rank} for mode ${mode} is greater than any defined rank. Assigning max role.`);
			return member.roles.add(maxRole);
		}

		const roleList = Object.values(roleIds).flat();
		await Promise.all(roleList.map(r => {
			if (member.roles.cache.has(r)) {
				return member.roles.remove(r);
			}
		}));
		const targetRole = roleIds[mode][roleIndex];
		console.log(targetRole);
		if (!targetRole) {
			console.error(`No role found for mode ${mode} and role index ${roleIndex}.`);
			return;
		}
		return member.roles.add(targetRole);
	},
};
