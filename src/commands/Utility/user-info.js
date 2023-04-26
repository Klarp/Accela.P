// Copyright (C) 2022 Brody Jagoe

// .force will use api instead of cache

const { EmbedBuilder } = require('discord.js');
const { Client } = require('../../index.js');
const { timeSince } = require('../../utils');

module.exports = {
	name: 'user-info',
	aliases: ['userinfo', 'uinfo'],
	description: 'Get information about yourself or a user',
	module: 'Utility',
	usage: '<user>',
	execute(message, args) {
		let member = message.mentions.members.first();
		let memberFlag = false;

		if (!member && args[0]) {
			memberFlag = true;
			member = message.guild.members.cache.get(args[0]);
		}

		if (!member && !memberFlag) member = message.member;

		let target = message.mentions.users.first();
		let targetFlag = false;

		if (!target && args[0]) {
			targetFlag = true;
			if (!message.guild.members.cache.get(args[0])) return message.reply('Could not find user.');
			target = message.guild.members.cache.get(args[0]).user;
		}

		if (!target && !targetFlag) target = message.member.user;

		const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });

		const joined = member.joinedAt;
		const created = target.createdAt;
		const joinTime = joined.toLocaleTimeString();
		const createdTime = created.toLocaleTimeString();
		const joinSince = timeSince(joined);
		const createdSince = timeSince(created);
		const [{ value: jmonth },, { value: jday },, { value: jyear }] = dateTimeFormat.formatToParts(joined);
		const [{ value: cmonth },, { value: cday },, { value: cyear }] = dateTimeFormat.formatToParts(created);

		const status = member.presence.status;

		const emoji = Client.emojis.cache;
		let statusEmoji;

		if (status === 'online') statusEmoji = emoji.get('940019133767094312');
		if (status === 'offline') statusEmoji = emoji.get('940019140213751809');
		if (status === 'idle') statusEmoji = emoji.get('940019134534651914');
		if (status === 'dnd') statusEmoji = emoji.get('940019133767090176');

		const roles = member.roles.cache
			.filter(r => r.name !== '@everyone')
			.sort((a, b) => b.position - a.position)
			.map(r => `${r}`).join(' | ');
		const name = member.nickname || 'None';

		const activities = member.presence.activities;
		let customStatus = 'None';
		let customStatusEmoji = '';
		let game = '';
		let gameStatus = '';
		let playing = '';

		if (member.presence.activities[0]) {
			if (activities[0].name === 'Custom Status') {
				customStatus = activities[0].state ? activities[0].state : '';
				customStatusEmoji = activities[0].emoji ? activities[0].emoji : '';

				if (activities[1]) {
					game = activities[1].name;
					gameStatus = activities[1].details;
				}
			} else {
				game = activities[0].name;
				gameStatus = activities[0].details;
			}
		}

		playing = `**Playing:** ${game} (${gameStatus})`;

		const infoEmbed = new EmbedBuilder()
			.setTitle(`${statusEmoji} ${target.tag} (${target.id})`)
			.setThumbnail(target.displayAvatarURL({ dynamic : true }))
			.setColor('BLUE')
			.setDescription(`**Nickname:** ${name} 
**Status:** ${status}
**Custom Status:** ${customStatusEmoji} ${customStatus}
${playing}
			
**Joined Server:** ${joinSince} \`${jday} ${jmonth} ${jyear} ${joinTime}\`
			
**Roles:** ${roles}`)
			.setFooter({ text: `Joined Discord: ${createdSince} (${cday} ${cmonth} ${cyear} ${createdTime})` });

		message.channel.send({ embeds: [infoEmbed] });
	},
};