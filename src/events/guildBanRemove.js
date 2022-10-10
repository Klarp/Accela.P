const { EmbedBuilder, PermissionsBitField, AuditLogEvent } = require('discord.js');
const { sleep } = require('../utils');

module.exports = {
	name: 'guildBanRemove',
	async execute(ban) {
		const guild = ban.guild;
		const user = ban.user;

		await sleep(1200);

		if (!guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;

		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanRemove,
		});

		const unBanLog = fetchedLogs.entries.first();

		// If mod logging is true log the unban
		if (guild.id === '98226572468690944') {
			if (!unBanLog) {
				const unbanEmbed = new EmbedBuilder()
					.setThumbnail(user.displayAvatarURL({ dynamic : true }))
					.setColor('#4BB580')
					.setTitle(`Unbanned ${user.tag}`)
					.setDescription(`:unlock: ${user}`)
					.setFooter({ text: `ID: ${user.id}` })
					.setTimestamp();

				if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [unbanEmbed] });
			} else {
				const { executor, target } = unBanLog;


				if (target.id === user.id) {
					const unbanEmbed = new EmbedBuilder()
						.setThumbnail(user.displayAvatarURL({ dynamic : true }))
						.setColor('#4BB580')
						.setTitle(`Unbanned ${user.tag}`)
						.setDescription(`:unlock: ${user}

**Moderator:** ${executor}`)
						.setFooter({ text: `ID: ${user.id}` })
						.setTimestamp();

					if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [unbanEmbed] });
				} else {
					const unbanEmbed = new EmbedBuilder()
						.setThumbnail(user.displayAvatarURL({ dynamic : true }))
						.setColor('#4BB580')
						.setTitle(`Unbanned ${user.tag}`)
						.setDescription(`:unlock: ${user}`)
						.setFooter({ text: `ID: ${user.id}` })
						.setTimestamp();

					if (guild.id === '98226572468690944') return guild.channels.cache.get('158484765136125952').send({ embeds: [unbanEmbed] });
				}
			}
		}
	},
};