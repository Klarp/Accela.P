// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require('discord.js');
const { sleep } = require('../utils/stringUtils');

module.exports = {
	name: 'guildBanRemove',
	async execute(ban) {
		const guild = ban.guild;
		const user = ban.user;

		await sleep(1200);

		// Early exit if bot does not have required permission
		if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;

		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanRemove,
		});

		const unBanLog = fetchedLogs.entries.first();

		// Only log the unban for specific guild ID
		if (guild.id !== '98226572468690944') return;

		// Create common unbanEmbed
		const unbanEmbed = new EmbedBuilder()
			.setThumbnail(user.displayAvatarURL({ dynamic : true }))
			.setColor(0x4BB580)
			.setTitle(`Unbanned ${user.tag}`)
			.setDescription(`:unlock: ${user}`)
			.setFooter({ text: `ID: ${user.id}` })
			.setTimestamp();

		if (unBanLog) {
			const { executor, target } = unBanLog;
			if (target.id === user.id) {
				unbanEmbed.setDescription(`:unlock: ${user}\n\n**Moderator:** ${executor}`);
			}
		}
		guild.channels.cache.get('158484765136125952').send({ embeds: [unbanEmbed] });
	},
};
