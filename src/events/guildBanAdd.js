// Copyright (C) 2022 Brody Jagoe

const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require('discord.js');
const { sleep } = require('../utils');

module.exports = {
	name: 'guildBanAdd',
	async execute(ban) {
		const guild = ban.guild;
		const user = ban.user;
		const member = guild.members.cache.get(user.id);
		let highestRole;

		if (!member) {
			highestRole = 'Unknown';
		} else {
			highestRole = member.roles.highest;
		}

		await sleep(1200);

		if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;

		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanAdd,
		});

		const banLog = fetchedLogs.entries.first();

		// If mod logging is true log the ban
		if (guild.id === '98226572468690944') {
			if (!banLog) {
				const banEmbed = new EmbedBuilder()
					.setThumbnail(user.displayAvatarURL({ dynamic : true }))
					.setColor('#EA4D4B')
					.setTitle(`Banned ${user.tag}`)
					.setDescription(`:lock: ${user}

**Highest Role:** ${highestRole}`)
					.setTimestamp();

				if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [banEmbed] });
			} else {
				const { executor, target, reason } = banLog;


				if (target.id === user.id && reason) {
					const banEmbed = new EmbedBuilder()
						.setThumbnail(user.displayAvatarURL({ dynamic : true }))
						.setColor('#EA4D4B')
						.setTitle(`Banned ${user.tag}`)
						.setDescription(`:lock: ${user}
					
**Highest Role:** ${highestRole}

**Moderator:** ${executor}
**Reason:** ${reason}`)
						.setFooter({ text: `ID: ${user.id}` })
						.setTimestamp();

					if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [banEmbed] });
				} else if(target.id === user.id && !reason) {
					const banEmbed = new EmbedBuilder()
						.setThumbnail(user.displayAvatarURL({ dynamic : true }))
						.setColor('#EA4D4B')
						.setTitle(`Banned ${user.tag}`)
						.setDescription(`:lock: ${user}

**Highest Role:** ${highestRole}

**Moderator:** ${executor}
**Reason:** No Reason Given`)
						.setFooter({ text: `ID: ${user.id}` })
						.setTimestamp();

					if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [banEmbed] });
				} else {
					const banEmbed = new EmbedBuilder()
						.setThumbnail(user.displayAvatarURL({ dynamic : true }))
						.setColor('#EA4D4B')
						.setTitle(`Banned ${user.tag}`)
						.setDescription(`:lock: ${user}

**Highest Role:** ${highestRole}`)
						.setFooter({ text: `ID: ${user.id}` })
						.setTimestamp();

					if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [banEmbed] });
				}
			}
		}
	},
};