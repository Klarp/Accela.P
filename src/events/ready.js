// Copyright (C) 2023 Brody Jagoe
const cron = require('node-cron');
const osu = require('node-osu');
const { Users } = require('../../database/dbObjects');
const { osu_key } = require('../../config.json');
const { updateRankRole } = require('../utils/discordUtils');
const osuApi = new osu.Api(osu_key);

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		let storedUsers = await Users.findAll();
		storedUsers = storedUsers
			.filter(u => u.get('verified_id'))
			.filter(u => u.verified_id !== null)
			.filter(u => client.users.cache.has(u.get('user_id')));

		client.updateRanks = async () => {
			for (let i = 0; i < Math.min(275, storedUsers.length); i++) {
				const user = storedUsers[i];
				const osuGame = client.guilds.cache.get('98226572468690944');

				const newRanks = {
					standard: 0,
					taiko: 0,
					mania: 0,
					catch: 0,
				};

				const osuID = user.get('verified_id');
				const userID = user.get('user_id');
				const userMode = user.get('mode');

				try {
					const osuUser = await osuApi.getUser({ u: osuID, m: userMode });
					newRanks[userMode] = osuUser.pp.rank;
				} catch (e) {
					console.error(`Error getting user data for user <@${osuID}>:`, e);
					continue;
				}

				try {
					const updateUser = await Users.update({
						std_rank: newRanks.standard,
						taiko_rank: newRanks.taiko,
						catch_rank: newRanks.catch,
						mania_rank: newRanks.mania,
					},
					{
						where: { user_id: userID },
					});
					if (updateUser > 0) {
						const rank = newRanks[userMode];
						const osuMember = osuGame.members.cache.get(userID);
						if (osuMember) {
							await updateRankRole(osuMember, rank, userMode);
						}
					}
				} catch (e) {
					console.error(`Error updating user ${userID}:`, e);
				}

				osuGame.channels.cache.get('776522946872344586').send(`Updated ranks for user <@${user.get('user_id')}>: ${JSON.stringify(newRanks)}`);
			}
		};

		cron.schedule('0 0 * * *', client.updateRanks);

		const activities_list = [
			'osu!',
			'Let\'s All Love Lain',
			'PHANTOMa',
			'The Wired',
			'at Phil\'s house',
			'osu! lazer',
			'at Cyberia',
			'h-help im trapped here',
			'l-let me out of this bot',
			'now run on human souls',
			'nekopara vol. 1',
			'finding nekopara dlc',
			'creating bot farms',
			'in secret now',
			'Human Soul Farming Sim 2022',
			'Now 100% Human Soul Free',
			'in the osu! server',
			'>>help for help',
			'Blue Zenith 727 wysi',
			'Yandere Simulator',
			'in your walls',
			'with my souls',
			'in Klarp\'s computer',
		];

		// Rotate through activities
		setInterval(() => {
			const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
			client.user.setActivity(activities_list[index]);
		}, 60 * 1000);

		console.log('[Event Logs] Accela is now ready');
	},
};