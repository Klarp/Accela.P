// Copyright (C) 2022 Brody Jagoe

module.exports = {
	name: 'touch',
	aliases: 'touchgrass',
	description: 'Please go outside',
	module: 'Fun',
	cooldown: 60,
	execute(message) {
		message.channel.send('https://cdn.discordapp.com/attachments/98226572468690944/931317787626971256/touch_grass.gif');
	},
};