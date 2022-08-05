// Copyright (C) 2022 Brody Jagoe

const { EmbedBuilder } = require('discord.js');
const { Client } = require('../../index');

module.exports = {
	name: 'shutdown',
	aliases: 'sd',
	description: 'Emergancy shutdown for the bot',
	module: 'Owner',
	owner: true,
	async execute(message) {
		const sdEmbed = new EmbedBuilder()
			.setTitle('EMERGANCY SHUTDOWN COMMENCED')
			.setDescription('Shutting down...');
		await message.channel.send({ embeds: [sdEmbed] });
		Client.destroy();
	},
};