// Copyright (C) 2023 Brody Jagoe

module.exports = {
	name: 'update',
	description: 'Updates Accela\'s verification',
	cooldown: 60,
	module: 'Osu!',
	async execute(message) {
		message.reply('This command is no longer available on Accela. Please use </verify:1369818139793162369> with <@1062420507607191642>');
	},
};