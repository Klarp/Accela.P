// Copyright (C) 2022 Brody Jagoe

const { EmbedBuilder } = require('discord.js');
const { Client } = require('../../index');

module.exports = {
	name: 'fake',
	description: 'Creates a fake halloween popup',
	module: 'Owner',
	owner: true,
	execute() {
		const osu_server = Client.guilds.cache.get('98226572468690944');
		const offtopic = osu_server.channels.cache.get('98226572468690944');

		const fakeEmbed = new EmbedBuilder()
			.setTitle('A trick-or-treater has stopped by!')
			.setColor('#7289DA')
			.setDescription('Open the door to greet them with h!treat')
			.setImage('https://cdn.discordapp.com/halloween-bot/Man-shark.png');

		offtopic.send({ embeds: [fakeEmbed] });
	},
};