// Copyright (C) 2023 Brody Jagoe

module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	description: 'Gets the avatar of the user',
	module: 'Utility',
	usage: '<user>',
	cooldown: 60,
	execute(message, args) {
		let target;
		if (args[0] === '-s') {
			target = message.mentions.members.first()?.user
					|| (args[1] && message.guild.members.cache.get(args[1]))
					|| message.member;
		} else {
			target = message.mentions.users.first()
					|| (args[0] && message.guild.members.cache.get(args[0])?.user)
					|| message.author;
		}

		if (!target) return message.reply('Could not find that user!');
		message.channel.send(target.displayAvatarURL({ size: 2048, dynamic: true }));
	},
};
