// Copyright (C) 2023 Brody Jagoe

const { Users } = require('../../../database/dbObjects');

module.exports = {
	name: 'db-check',
	aliases: ['dbcheck', 'checkdb'],
	description: 'Checks the user database for any inconsistencies',
	module: 'Owner',
	owner: true,
	async execute() {
		const users = await Users.findAll();
		const osuNames = new Set();
		const duplicateUsers = new Set();

		for (const user of users) {
			if (osuNames.has(user.osu_name)) {
				duplicateUsers.add(user);
				continue;
			}
			osuNames.add(user.osu_name);
		}

		for (const user of duplicateUsers) {
			console.log(`Deleting duplicate user: ${user.osu_name}, with user_id: ${user.user_id}`);
			await Users.destroy({
				where: {
					user_id: user.user_id,
				},
			});
		}

		console.log('Database checked. All duplicates have been removed.');

		const remainingUsers = await Users.findAll();

		for (const user of remainingUsers) {
			console.log(`User ID: ${user.user_id}, Osu Name: ${user.osu_name}`);
		}
	},
};
