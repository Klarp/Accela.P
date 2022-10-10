// Copyright (C) 2022 Brody Jagoe

const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'repo',
	description: 'Posts the github repository',
	module: 'Utility',
	execute(message) {
		const repoEmbed = new EmbedBuilder().setTitle('GitHub Repository').addFields([ { name: 'repo', value: 'https://github.com/Klarp/Accela.P' } ]).setColor('#2F3136');
		message.channel.send({ embeds: [repoEmbed] });
	},
};