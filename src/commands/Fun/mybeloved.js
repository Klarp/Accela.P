// Copyright (C) 2022 Brody Jagoe

module.exports = {
	name: 'mybeloved',
	aliases: ['beloved', 'taikoguy', 'thattaikoguy'],
	description: 'Requested by udude',
	module: 'Fun',
	cooldown: 60,
	execute(message) {
		message.channel.send('https://cdn.discordapp.com/attachments/98226572468690944/938283940396007434/mybeloved.gif');
	},
};