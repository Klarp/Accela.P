// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require('discord.js');
const { sleep } = require('../utils/stringUtils');

module.exports = {
	name: 'guildBanAdd',
	async execute(ban) {
		const guild = ban.guild;
		const user = ban.user;
		const member = guild.members.cache.get(user.id);
		const highestRole = member ? member.roles.highest : 'Unknown';

		await sleep(1200);

		// Early exit if bot does not have required permission
		if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;

		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanAdd,
		});

		const banLog = fetchedLogs.entries.first();

		// Only log the ban for specific guild ID
		if (guild.id !== '98226572468690944') return;

		// Create common banEmbed
		const banEmbed = new EmbedBuilder()
			.setThumbnail(user.displayAvatarURL({ dynamic : true }))
			.setColor(0xEA4D4B)
			.setTitle(`Banned ${user.tag}`)
			.setDescription(`:lock: ${user}\n\n**Highest Role:** ${highestRole}`)
			.setFooter({ text: `ID: ${user.id}` })
			.setTimestamp();

		if (banLog) {
			const { executor, target, reason } = banLog;
			if (target.id === user.id) {
				banEmbed.setDescription(`:lock: ${user}\n\n**Highest Role:** ${highestRole}\n\n**Moderator:** ${executor}\n\n**Reason:** ${reason || 'No Reason Given'}`);
			}
		}
		guild.channels.cache.get('158484765136125952').send({ embeds: [banEmbed] });
	},
};
