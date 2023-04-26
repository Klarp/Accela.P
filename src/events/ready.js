// Copyright (C) 2022 Brody Jagoe

const { Collection } = require('discord.js');
// const { Queue } = require('queue-system');
// const osu = require('node-osu');

// const { osu_key } = require('../../config.json');
const { Users, sConfig } = require('../../database/dbObjects');
// const { getRankRole } = require('../utils');
// const Sentry = require('../../log');

// const osuApi = new osu.Api(osu_key);

// let lbDate = Date.now();

/*
module.exports.upDate = () => {
	if (lbDate) {
		return lbDate;
	}
};
*/

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		// Initialize osu! Database
		const storedUsers = await Users.findAll();
		storedUsers
			.filter(user => user.verified_id !== null)
			.filter(user => client.users.cache.has(user.user_id));
		/*
		// Verified User Update
		const q = new Queue({ concurrency: 1 });

		const osuApi = new osu.Api(osu_key);
		const osuGame = client.guilds.cache.get('98226572468690944');
		const logChannel = osuGame.channels.cache.get('776522946872344586');

		const updateUser = async (u) => {
			logChannel.send(`Updating ${u.osu_name} with osu! ID: ${u.verified_id}`);
			const osuID = u.get('verified_id');
			const userID = u.get('user_ud');
			const mode = u.get('osu_mode');
			let std_rank = null;
			let taiko_rank = null;
			let ctb_rank = null;
			let mania_rank = null;

			// Standard
			await osuApi.getUser({ u: osuID, m: 0 }).then(osuUser => {
				std_rank = osuUser.pp.rank;
				if (std_rank === '0') std_rank = null;
				console.log(`Updating ${u.osu_name} std rank to ${std_rank}`);
			});

			// Taiko
			await osuApi.getUser({ u: osuID, m: 1 }).then(osuUser => {
				taiko_rank = osuUser.pp.rank;
				if (taiko_rank === '0') taiko_rank = null;
				console.log(`Updating ${u.osu_name} taiko rank to ${taiko_rank}`);
			});

			// Catch the Beat
			await osuApi.getUser({ u: osuID, m: 2 }).then(osuUser => {
				ctb_rank = osuUser.pp.rank;
				if (ctb_rank === '0') ctb_rank = null;
				console.log(`Updating ${u.osu_name} ctb rank to ${ctb_rank}`);
			});

			// Mania
			await osuApi.getUser({ u: osuID, m: 3 }).then(osuUser => {
				mania_rank = osuUser.pp.rank;
				if (mania_rank === '0') mania_rank = null;
				console.log(`Updating ${u.osu_name} mania rank to ${mania_rank}`);
			});

			try {
				console.log('Starting rank role update');
				const upUser = await Users.update({
					std_rank: std_rank,
					taiko_rank: taiko_rank,
					ctb_rank: ctb_rank,
					mania_rank: mania_rank,
				},
				{
					where: { user_id: userID },
				});
				if (upUser > 0) {
					console.log('Adding/Updating rank roles');
					let rank;
					if (mode === 0 && std_rank !== null) rank = std_rank;
					if (mode === 1 && taiko_rank !== null) rank = taiko_rank;
					if (mode === 2 && ctb_rank !== null) rank = ctb_rank;
					if (mode === 3 && mania_rank !== null) rank = mania_rank;
					const osuMember = osuGame.members.cache.get(userID);

					if (osuMember) {
						console.log(osuMember);
						getRankRole(osuMember, rank, mode);
					}
				}
			} catch (err) {
				console.error(err);
				Sentry.captureException(err);
			}
		};

		// Need this rate limited to add users to the queue at a rate lower then 1200 requests per minute with room for 3000 users
		const osuUsers = await Users.findAll();

		logChannel.send(`**Started processing of ${osuUsers.length} members**`);

		for (let i = 0; i < osuUsers.length; i++) {
			q.add(updateUser(osuUsers[i]));
		}

		// Old code below

		/*
			let finishDate = lbDate - startDate;
			finishDate = finishDate / 60000;
			logChannel.send(`**Finished processing in ${finishDate.toFixed(2)} minutes**`);
		*/

		/*
		setInterval(async () => {
			const osuUsers = await Users.findAll();
			startDate = Date.now();

			// logChannel.send(`**Started processing of ${osuUsers.length} members**`);

			for (let i = 0; i < osuUsers.length; i++) {
				q.push(osuUsers[i]);
			}
		}, 1000 * 60 * 60 * 24);
		*/

		// Initialize Server Database
		const serverConfigs = await sConfig.findAll();
		const configs = new Collection();
		serverConfigs.forEach(s => configs.set(s.guild_id, s));

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