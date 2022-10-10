// Copyright (C) 2022 Brody Jagoe

module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	description: 'Gets the avatar of the user',
	module: 'Utility',
	usage: '<user>',
	cooldown: 60,
	execute(message, args) {
		if (args[0] === '-s') {
			let menMember = message.mentions.members.first();
			let memberFlag = false;

			if (!menMember && args[1]) {
				memberFlag = true;
				if (!message.guild.members.cache.get(args[1])) return message.reply('Could not find that user!');
				menMember = message.guild.members.cache.get(args[1]);
			}

			if (!menMember && memberFlag) menMember = message.member;

			if (menMember) {
<<<<<<< Updated upstream:commands/Utility/avatar.js
				message.channel.send(menMember.displayAvatarURL({ size:256, dynamic:true }));
			} else {
				message.channel.send(message.member.displayAvatarURL({ size:256, dynamic:true }));
=======
				message.channel.send(menMember.displayAvatarURL({ size: 2048, dynamic: true }));
			} else {
				message.channel.send(message.member.displayAvatarURL({ size: 2048, dynamic: true }));
>>>>>>> Stashed changes:src/commands/Utility/avatar.js
			}
		} else {
			let menUser = message.mentions.users.first();
			let userFlag = false;
			if (!menUser && args[0]) {
				userFlag = true;
				if (!message.guild.members.cache.get(args[0])) return message.reply('Could not find that user!');
				menUser = message.guild.members.cache.get(args[0]).user;
			}
			if (!menUser && userFlag) menUser = message.user;

			if(menUser) {
<<<<<<< Updated upstream:commands/Utility/avatar.js
				message.channel.send(menUser.displayAvatarURL({ size:256, dynamic:true }));
			} else {
				message.channel.send(message.author.displayAvatarURL({ size:256, dynamic:true }));
=======
				message.channel.send(menUser.displayAvatarURL({ size: 2048, dynamic: true }));
			} else {
				message.channel.send(message.author.displayAvatarURL({ size: 2048, dynamic: true }));
>>>>>>> Stashed changes:src/commands/Utility/avatar.js
			}
		}
	},
};