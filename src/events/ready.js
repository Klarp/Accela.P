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
		const userIdSet = new Set();

		storedUsers = storedUsers
			.filter(u => u.get('verified_id'))
			.filter(u => u.verified_id !== null)
			.filter(u => {
				const userId = u.get('user_id');
				if (client.users.cache.has(userId) && !userIdSet.has(userId)) {
					userIdSet.add(userId);
					return true;
				}
				return false;
			});
		client.updateRanks = async () => {
			const mapper = async (user) => {
				const osuGame = client.guilds.cache.get('98226572468690944');

				const newRanks = {
					std: 0,
					taiko: 0,
					mania: 0,
					ctb: 0,
				};

				const osuID = user.get('verified_id');
				const userID = user.get('user_id');
				const modeMap = new Map([[0, 'std'], [1, 'taiko'], [2, 'ctb'], [3, 'mania']]);
				const userMode = modeMap.get(user.get('osu_mode'));
				console.log(`ready.js: User ID: ${userID}, osu! Mode ID: ${user.get('osu_mode')}, Selected Mode: ${userMode}`);

				if (!userMode) {
					console.error(`Mode not set for user <@${userID}>.`);
					return;
				}

				console.log(user.get('osu_name'), user.get('osu_mode'), userMode);

				// Loop through all modes to update ranks in the database
				for (const [modeId, mode] of modeMap) {
					try {
						const osuUser = await osuApi.getUser({ u: osuID, m: modeId });
						newRanks[mode] = osuUser.pp.rank;

						// Update the rank in the database for this mode
						const updateData = {};
						updateData[mode + '_rank'] = newRanks[mode];
						await Users.update(updateData, { where: { user_id: userID } });
					} catch (e) {
						console.error(`Error handling user <@${osuID}> for mode ${mode}:`, e);
						return;
					}
				}

				const osuMember = osuGame.members.cache.get(userID);
				if (osuMember) {
					await updateRankRole(osuMember, newRanks[userMode], userMode);
				}

				osuGame.channels.cache.get('776522946872344586').send(`Updated ranks for user ${user.get('osu_name')}: ${JSON.stringify(newRanks)}`);
			};

			const processWithLimitedConcurrency = async (users, limit) => {
				let results = [];
				for (let i = 0; i < users.length; i += limit) {
					const chunk = users.slice(i, i + limit);
					results = results.concat(await Promise.all(chunk.map(mapper)));
				}
				return results;
			};
			await processWithLimitedConcurrency(storedUsers.slice(0, 275), 20);
		};

		console.log(typeof client.updateRanks);

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