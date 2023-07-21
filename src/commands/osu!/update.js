// Copyright (C) 2023 Brody Jagoe
const osu = require('node-osu');
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const Sentry = require('../../../log');
const { updateRankRole, hasPermission } = require('../../utils/discordUtils');
const { osu_key } = require('../../../config.json');
const { Users, sConfig } = require('../../../database/dbObjects');
const { Client } = require('../../index');

// Function to handle retrieving user ranks for the different game modes.
const getUserRanks = async (osuApi, osuId) => {
	const modes = [0, 1, 2, 3];
	const ranks = ['std_rank', 'taiko_rank', 'ctb_rank', 'mania_rank'];
	const rankResults = {};

	for (let i = 0; i < modes.length; i++) {
		try {
			const osuUser = await osuApi.getUser({ u: osuId, m: modes[i] });
			rankResults[ranks[i]] = osuUser.pp.rank === '0' ? null : osuUser.pp.rank;
		} catch (error) {
			Sentry.captureException(error);
			console.error(error);
			rankResults[ranks[i]] = null;
		}
	}

	return rankResults;
};

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
					setTimeout(() => msg.delete(), 5000);
				});
			}
			if (user.verified_id && Client.users.cache.has(user.user_id)) {
				const osuID = user.get('verified_id');
				const userID = user.get('user_id');
				const mode = user.get('osu_mode');

				try {
					const { std_rank, taiko_rank, ctb_rank, mania_rank } = await getUserRanks(osuApi, osuID);

					const upUser = await Users.update({
						std_rank,
						taiko_rank,
						ctb_rank,
						mania_rank,
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
							updateRankRole(osuMember, rank, mode);
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
						.setColor(0xaf152a)
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
			if (!hasPermission(message.member, PermissionsBitField.Flags.KickMembers, message)) return;
			let findUser;
			if (message.mentions.users.first()) {
				findUser = message.mentions.users.first();
			} else if (message.guild.members.cache.get(args[1])) {
				findUser = message.guild.members.cache.get(args[1]);
			}

			const user = await Users.findOne({ where: { user_id: findUser.id } });

			if (!user) {
				return message.reply('User is not verified!').then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
			if (user.verified_id && Client.users.cache.has(user.user_id)) {
				const osuID = user.get('verified_id');
				const userID = user.get('user_id');
				const mode = user.get('osu_mode');

				try {
					const { std_rank, taiko_rank, ctb_rank, mania_rank } = await getUserRanks(osuApi, osuID);

					const upUser = await Users.update({
						std_rank,
						taiko_rank,
						ctb_rank,
						mania_rank,
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
							updateRankRole(osuMember, rank, mode);
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
						.setAuthor({ name: findUser.username })
						.setColor(0xaf152a)
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