// Copyright (C) 2023 Brody Jagoe

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const activities_list = [
			'osu!',
			'Let\'s All Love Lain',
			'PHANTOMa',
			'The Wired',
			'at Phil\'s house',
			'osu! lazer',
			'at Cyberia',
			'h-help im trapped here',
			'l-let me out of this bot',
			'now run on human souls',
			'nekopara vol. 1',
			'finding nekopara dlc',
			'creating bot farms',
			'in secret now',
			'Human Soul Farming Sim 2022',
			'Now 100% Human Soul Free',
			'in the osu! server',
			'>>help for help',
			'Blue Zenith 727 wysi',
			'Yandere Simulator',
			'in your walls',
			'with my souls',
			'in Klarp\'s computer',
		];

		// Rotate through activities
		setInterval(() => {
			const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
			client.user.setActivity(activities_list[index]);
		}, 60 * 1000);

		console.log('[Event Logs] Accela is now ready');
	},
};