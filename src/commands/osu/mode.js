// Copyright (C) 2023 Brody Jagoe

const osu = require('node-osu');

const { EmbedBuilder } = require('discord.js');

const Sentry = require('../../../log');
const { Client } = require('../../index');
const { Users } = require('../../../database/dbObjects');
const { osu_key } = require('../../../config.json');
const { updateRankRole } = require('../../utils/discordUtils');

module.exports = {
	name: 'mode',
	description: 'Changes mode for rank role system (Beta Feature)',
	module: 'Osu!',
	guildOnly: true,
	disableOsu: true,
	usage: '<mode>',
	async execute(message, args) {
		const osuApi = new osu.Api(osu_key);

		const osuGame = Client.guilds.cache.get('98226572468690944');
		const osuMember = osuGame.members.cache.get(message.author.id);

		const modeNums = {
			'std': 0,
			'standard': 0,
			'taiko': 1,
			'ctb': 2,
			'catch the beat': 2,
			'catch': 2,
			'mania': 3,
		};

		const modeNames = {
			0: 'std',
			1: 'taiko',
			2: 'ctb',
			3: 'mania',
		};

		const modes = ['std', 'taiko', 'ctb', 'mania', 'standard', 'catch the beat', 'catch'];

		const noVerifyEmbed = new EmbedBuilder()
			.setTitle('Please Verify Your osu! Account!')
			.setDescription('https://accela.xyz/verify.html')
			.setColor(0xaf152a);

		const user = await Users.findOne({ where: { user_id: message.author.id } });

		if (!user) return message.channel.send({ embeds: [noVerifyEmbed] });
		if (!user.get('verified_id')) return message.channel.send({ embeds: [noVerifyEmbed] });
		if (!osuMember) return message.reply('this is a closed beta feature.');

		if (!args[0]) {
			const modeEmbed = new EmbedBuilder()
				.setTitle('Which mode would you like?')
				.setColor(0xaf152a)
				.setDescription(`**std (Standard)**
**mania**
**taiko**
**ctb (Catch The Beat or Catch)**`)
				.setFooter({ text: 'Use >>mode [mode]' });
			message.channel.send({ embeds: [modeEmbed] });
		} else {
			const mode = args[0].toLowerCase();

			if (!modes.includes(mode)) return message.channel.send('Invalid Mode! Please try again.');

			const userMode = modeNums[mode];

			const id = user.get('verified_id');

			let rank = null;

			await osuApi.getUser({ u: id, m: userMode }).then(async u => {
				rank = u.pp.rank;
				if (rank === '0') rank = null;
				try {
					// Standard
					if (userMode === 0) {
						const upNum = await Users.update({
							osu_mode: userMode,
							std_rank: rank,
						},
						{
							where: { user_id: message.author.id },
						});
						if (upNum > 0) {
							return message.reply(`Updated gamemode to osu!${mode}`);
						} else {
							return message.reply('No linked account found!');
						}
					}
					// Taiko
					if (userMode === 1) {
						const upNum = await Users.update({
							osu_mode: userMode,
							taiko_rank: rank,
						},
						{
							where: { user_id: message.author.id },
						});
						if (upNum > 0) {
							return message.reply(`Updated gamemode to osu!${mode}`);
						} else {
							return message.reply('No linked account found!');
						}
					}
					// ctb
					if (userMode === 2) {
						const upNum = await Users.update({
							osu_mode: userMode,
							ctb_rank: rank,
						},
						{
							where: { user_id: message.author.id },
						});
						if (upNum > 0) {
							return message.reply(`Updated gamemode to osu!${mode}`);
						} else {
							return message.reply('No linked account found!');
						}
					}
					// Mania
					if (userMode === 3) {
						const upNum = await Users.update({
							osu_mode: userMode,
							mania_rank: rank,
						},
						{
							where: { user_id: message.author.id },
						});
						if (upNum > 0) {
							return message.reply(`Updated gamemode to osu!${mode}`);
						} else {
							return message.reply('No linked account found!');
						}
					}
				} catch(e) {
					Sentry.captureException(e);
					console.error(e);
					return message.reply('Error: "Something" wen\'t wrong.');
				}
			});
			const modeName = modeNames[userMode];
			updateRankRole(message.member, rank, modeName);
		}
	},
};