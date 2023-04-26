// Copyright (C) 2022 Brody Jagoe
const osu = require('node-osu');

const { EmbedBuilder, ChannelType } = require('discord.js');

const Sentry = require('../../../log');
const { getRankRole } = require('../../utils');
const { osu_key, owners } = require('../../../config.json');
const { Users, sConfig } = require('../../../database/dbObjects');
const { Client } = require('../../index');

module.exports = {
	name: 'update',
	description: 'Updates Accela\'s verification',
	cooldown: 60,
	module: 'Osu!',
	async execute(message, args) {
		const option = args[0];
		const osuApi = new osu.Api(osu_key);
		const storedUsers = await Users.findAll();
		let prefix = '>>';
		let serverConfig;
		if (message.channel.type !== ChannelType.DM) {
			serverConfig = await sConfig.findOne({ where: { guild_id: message.guild.id } });
		}

		if (serverConfig) {
			prefix = serverConfig.get('prefix');
		}

		storedUsers
			.filter(user => user.verified_id !== null)
			.filter(user => Client.users.cache.has(user.user_id));

		const osuGame = Client.guilds.cache.get('98226572468690944');
		const logChannel = osuGame.channels.cache.get('776522946872344586');

		if (!option) {
			const user = await Users.findOne({ where: { user_id: message.author.id } });

			if (!user) {
				return message.reply(`User is not verified! Use \`${prefix}verify\` to verify!`).then(msg => {
					setTimeout(() => msg.delete, 5000);
				});
			}
			if (user.verified_id && Client.users.cache.has(user.user_id)) {
				const osuID = user.get('verified_id');
				const userID = user.get('user_id');
				const mode = user.get('osu_mode');

				let std_rank = null;
				let taiko_rank = null;
				let ctb_rank = null;
				let mania_rank = null;

				// std
				await osuApi.getUser({ u: osuID, m: 0 }).then(osuUser => {
					std_rank = osuUser.pp.rank;
					if (std_rank === '0') std_rank = null;
				});
				// Taiko
				await osuApi.getUser({ u: osuID, m: 1 }).then(osuUser => {
					taiko_rank = osuUser.pp.rank;
					if (taiko_rank === '0') taiko_rank = null;
				});
				// ctb
				await osuApi.getUser({ u: osuID, m: 2 }).then(osuUser => {
					ctb_rank = osuUser.pp.rank;
					if (ctb_rank === '0') ctb_rank = null;
				});
				// Mania
				await osuApi.getUser({ u: osuID, m: 3 }).then(osuUser => {
					mania_rank = osuUser.pp.rank;
					if (mania_rank === '0') mania_rank = null;
				});

				try {
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
						let rank;
						if (mode === 0 && std_rank !== null) rank = std_rank;
						if (mode === 1 && taiko_rank !== null) rank = taiko_rank;
						if (mode === 2 && ctb_rank !== null) rank = ctb_rank;
						if (mode === 3 && mania_rank !== null) rank = mania_rank;
						const osuMember = osuGame.members.cache.get(userID);
						if (osuMember) {
							getRankRole(osuMember, rank, mode);
							logChannel.send(`**Updating ${message.author}**`);
						}
					}

					const modeNums = {
						0: 'osu!std',
						1: 'osu!taiko',
						2: 'osu!ctb',
						3: 'osu!mania',
					};

					const osuMode = modeNums[user.get('osu_mode')];

					const updateEmbed = new EmbedBuilder()
						.setTitle('Verification Update')
						.setAuthor({ name: message.author.tag })
						.setColor('#af152a')
						.setDescription(`Mode: ${osuMode}
osu!std: ${std_rank}
osu!taiko: ${taiko_rank}
osu!ctb: ${ctb_rank}
osu!mania: ${mania_rank}`);

					message.channel.send({ embeds: [updateEmbed] });
				} catch (err) {
					Sentry.captureException(err);
					console.error(err);
				}
			}
		} else if (option === 'user') {
			if (!owners.includes(message.author.id)) return;
			let findUser;
			if (message.mentions.users.first()) {
				findUser = message.mentions.users.first();
			} else if (message.guild.members.cache.get(args[1])) {
				findUser = message.guild.members.cache.get(args[1]);
			}

			const user = await Users.findOne({ where: { user_id: findUser.id } });
			console.log(user);

			if (!user) {
				return message.reply('User is not verified!').then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
			if (user.verified_id && Client.users.cache.has(user.user_id)) {
				const osuID = user.get('verified_id');
				const userID = user.get('user_id');
				const mode = user.get('osu_mode');

				let std_rank = null;
				let taiko_rank = null;
				let ctb_rank = null;
				let mania_rank = null;

				// std
				await osuApi.getUser({ u: osuID, m: 0 }).then(osuUser => {
					std_rank = osuUser.pp.rank;
					if (std_rank === '0') std_rank = null;
				});
				// Taiko
				await osuApi.getUser({ u: osuID, m: 1 }).then(osuUser => {
					taiko_rank = osuUser.pp.rank;
					if (taiko_rank === '0') taiko_rank = null;
				});
				// ctb
				await osuApi.getUser({ u: osuID, m: 2 }).then(osuUser => {
					ctb_rank = osuUser.pp.rank;
					if (ctb_rank === '0') ctb_rank = null;
				});
				// Mania
				await osuApi.getUser({ u: osuID, m: 3 }).then(osuUser => {
					mania_rank = osuUser.pp.rank;
					if (mania_rank === '0') mania_rank = null;
				});

				try {
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
						let rank;
						if (mode === 0 && std_rank !== null) rank = std_rank;
						if (mode === 1 && taiko_rank !== null) rank = taiko_rank;
						if (mode === 2 && ctb_rank !== null) rank = ctb_rank;
						if (mode === 3 && mania_rank !== null) rank = mania_rank;
						const osuMember = osuGame.members.cache.get(userID);
						if (osuMember) {
							getRankRole(osuMember, rank, mode);
							logChannel.send(`**Force Updating ${findUser}**`);
						}
					}

					const modeNums = {
						0: 'osu!std',
						1: 'osu!taiko',
						2: 'osu!ctb',
						3: 'osu!mania',
					};

					const osuMode = modeNums[user.get('osu_mode')];

					const updateEmbed = new EmbedBuilder()
						.setTitle('Verification Update')
						.setAuthor({ name: findUser.tag })
						.setColor('#af152a')
						.setDescription(`Mode: ${osuMode}
osu!std: ${std_rank}
osu!taiko: ${taiko_rank}
osu!ctb: ${ctb_rank}
osu!mania: ${mania_rank}`);

					message.channel.send({ embeds: [updateEmbed] });
				} catch (err) {
					Sentry.captureException(err);
					console.error(err);
				}
			}
		}
	},
};