// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, Collection } = require('discord.js');

const { Users } = require('../../../database/dbObjects');
const { titleCase } = require('../../utils/stringUtils');
const { modeRanks } = require('../../../config.json');

const userList = new Collection();

module.exports = {
	name: 'leaderboard',
	guildOnly: true,
	aliases: 'lb',
	description: 'Leaderboard of verified osu! accounts in the server',
	module: 'Osu!',
	disableOsu: true,
	async execute(message, args) {
		const users = await Users.findAll();
		const server = message.guild;
		const modes = ['std', 'taiko', 'ctb', 'mania'];
		const mode = args[0] ? args[0].toLowerCase() : 'std';
		if (!modes.includes(mode)) return message.channel.send('Invalid Mode! Please try again.');

		const nameColumnWidth = 32;
		const rankColumnWidth = 9;

		let table = '';
		table += getHeader(nameColumnWidth, rankColumnWidth) + '\n';

		await users.forEach(u => userList.set(u.user_id, { verified_id: u.verified_id, user_id: u.user_id, osu_name: u.osu_name, rank: u[modeRanks[mode]] }));

		const newList = userList.sort((a, b) => a.rank - b.rank)
			.filter(user => server.members.cache.has(user.user_id))
			.filter(user => user.verified_id !== null)
			.filter(user => user.rank !== null && user.rank > 0);

		const leaderList = newList.first(10);

		for (let i = 0; i < leaderList.length; i++) {
			table += getRow(i + 1, leaderList[i], nameColumnWidth, rankColumnWidth) + '\n';
		}

		const listArray = Array.from(newList.values());
		const posNumber = listArray.findIndex(u => u.user_id === message.author.id) + 1;
		const listUser = listArray.find(u => u.user_id === message.author.id);

		table += getPos(posNumber, listArray, listUser, nameColumnWidth, rankColumnWidth);

		const leaderEmbed = new EmbedBuilder()
			.addFields(
				{ name: `${message.guild.name} Discord Leaderboard (osu!${mode})`, value: `\`\`\`scala\n${table}\n\`\`\`` },
			)
			.setColor(0xaf152a);
		message.channel.send({ embeds: [leaderEmbed] });

		function getHeader(nameWidth, rankWidth) {
			const header = 'Name (osu! User)'.padEnd(nameWidth) + '| Rank'.padEnd(rankWidth) + '|';
			const divider = '+'.padStart(nameWidth + 1, '-') + '+'.padEnd(rankWidth + 1, '-');
			return `${header}\n${divider}`;
		}

		function getRow(pos, user, nameWidth, rankWidth) {
			const discordUser = server.members.cache.get(user.user_id).user;
			const discordTag = titleCase(discordUser.tag);
			let userName = `${pos}. ${discordTag} (${user.osu_name})`;

			let longName;

			if (userName.length > nameWidth) {
				userName = `${pos}. ${discordTag}`;
				longName = user.osu_name;
			}

			const row = `${userName.padEnd(nameWidth)}| ${user.rank.toString().padEnd(rankWidth - 1)}|`;

			if (longName) {
				const longNameRow = `(${longName}).padEnd(nameWidth - 1)| `.padEnd(rankWidth) + '|';
				return `${row}\n${longNameRow}`;
			}

			return row;
		}


		function getPos(pos, list, user, nameWidth, rankWidth) {
			if (!user) return '';

			const rank = user.rank;
			const positionText = `Your Position: ${pos}/${list.length}`;
			const divider = '+'.padStart(nameWidth + 1, '-') + '+'.padEnd(rankWidth + 1, '-');
			const posRow = `${positionText.padEnd(nameWidth)}| ${rank.toString().padEnd(rankWidth - 1)}|`;

			return `${divider}\n${posRow}`;
		}
	},
};


/*
Name                      	 | Rank          |
-----------------------------|---------------|
1. shoultzz#1111 (shoultzzz) | 4,500
2. taiki#1111 (taiki)        | 5,000
3. nyanise#1111 (nyanise)    | 14,589
4. klarp#1111 (klarp)   	 | 43,878
5. phil#1111 (phil)          | 56,789
6. man#1111 (man 1)          | 100,223
7. man2#1111 (man 2)         | 125,554
8. man3#1111 (man 3)         | 300,433
9. man4#1111 (man 4)         | 345,567
10.man5#1111 (man 5)         | 589,998
-----------------------------|---------------|
Your position: 4/200
*/