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
		console.log(`user: ${member.user.username} | rank: ${rank} | mode: ${mode}`);
		if (rank === 0 || rank === null || rank === undefined || rank > ranks[mode][ranks[mode].length - 1]) {
			const maxRole = roleIds[mode][roleIds[mode].length - 1];
			if (member.roles.cache.has(maxRole)) {
				console.log(`User already has max role for mode ${mode}. No need to update.`);
				return;
			}

			// Remove all rank roles
			const roleList = Object.values(roleIds).flat();
			await Promise.all(roleList.map(r => {
				if (member.roles.cache.has(r)) {
					member.roles.remove(r);
				}
			}));

			if (!maxRole) {
				console.error(`No max role found for mode ${mode}.`);
				return;
			}
			return member.roles.add(maxRole);
		}

		const roleIndex = ranks[mode].findIndex(r => rank < r);
		const targetRole = roleIds[mode][roleIndex];

		if (member.roles.cache.has(targetRole)) {
			console.log(`User already has target role for mode ${mode} and rank ${rank}. No need to update.`);
			return;
		}

		// Remove all rank roles
		const roleList = Object.values(roleIds).flat();
		await Promise.all(roleList.map(r => {
			if (member.roles.cache.has(r)) {
				member.roles.remove(r);
			}
		}));

		if (!targetRole) {
			console.error(`No role found for mode ${mode} and role index ${roleIndex}.`);
			return;
		}
		return member.roles.add(targetRole);
	},
};
