// Copyright (C) 2023 Brody Jagoe

const osu = require('node-osu');
const { ChannelType } = require('discord.js');
const { sendEmbedMessage, handleError } = require('../../utils/osuUtils');
const { osu_key } = require('../../../config.json');
const { Users, sConfig } = require('../../../database/dbObjects');
const { Client } = require('../../index');

module.exports = {
	name: 'taiko',
	aliases: ['drums'],
	description: 'Gets the requested osu! user information for taiko',
	module: 'Osu!',
	disableOsu: true,
	usage: '<user>',
	async execute(message, args) {
		const osuApi = new osu.Api(osu_key, {
			notFoundAsError: true,
			completeScores: true,
			parseNumeric: true,
		});

		let prefix = '>>';

		let findUser = message.mentions.users.first()
			|| message.guild.members.cache.get(args[0])
			|| message.member;

		if (message.channel.type !== ChannelType.DM) {
			const serverConfig = await sConfig.findOne({ where: { guild_id: message.guild.id } });
			if (serverConfig) prefix = serverConfig.get('prefix');
		}

		const verifiedEmote = Client.guilds.cache.get('687858540425117755').emojis.cache.find(emoji => emoji.name === 'verified');

		findUser = await Users.findOne({ where: { user_id: findUser.id } });

		const name = findUser?.get('verified_id') || findUser?.get('osu_id') || (args[0] && args.join(' ')) || findUser.username;
		const verified = findUser && findUser.get('verified_id') ? `${verifiedEmote} Verified` : `:x: Not Verified [use ${prefix}verify]`;

		try {
			const user = await osuApi.getUser({ m: 1, u: name });
			sendEmbedMessage(user, verified, message, 'taiko', name);
		} catch(e) {
			handleError(e, message, name);
		}
	},
};
