// Copyright (C) 2022 Brody Jagoe

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'repo',
	description: 'Posts the github repository',
	module: 'Utility',
	execute(message) {
<<<<<<< Updated upstream:commands/Utility/repo.js
		const repoEmbed = new MessageEmbed().setTitle('GitHub Repository').addField('repo', 'https://github.com/Klarp/Accela').setColor('#2F3136');
=======
		const repoEmbed = new EmbedBuilder().setTitle('GitHub Repository').addField('repo', 'https://github.com/Klarp/Accela.P').setColor('#2F3136');
>>>>>>> Stashed changes:src/commands/Utility/repo.js
		message.channel.send({ embeds: [repoEmbed] });
	},
};