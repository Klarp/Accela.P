// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Client } = require('../../index');
const { sConfig } = require('../../../database/dbObjects');
const { version } = require('../../../package.json');
const discordjs = require('../../../node_modules/discord.js/package.json');

module.exports = {
	name: 'bot-info',
	aliases: ['botinfo', 'binfo', 'info'],
	description: 'Get information about the bot',
	module: 'Utility',
	async execute(message) {
		let prefix = '>>';
		const serverConfig = await sConfig.findOne({ where: { guild_id: message.guild.id } });
		if (serverConfig) {
			prefix = serverConfig.get('prefix');
		}
		const bot = Client.user;
		const me = message.guild.members.me;
		const roles = me.roles.cache
			.filter(r => r.name !== '@everyone')
			.sort((a, b) => b.position - a.position)
			.map(r => `${r}`).join(' | ');
		let userCount = 0;
		const discordjsVersion = discordjs.version;

		Client.guilds.cache
			.each(guild => userCount += guild.memberCount);

		function dhm(t) {
			const cd = 24 * 60 * 60 * 1000;
			const ch = 60 * 60 * 1000;
			let d = Math.floor(t / cd);
			let h = Math.floor((t - d * cd) / ch);
			let m = Math.round((t - d * cd - h * ch) / 60000);
			const pad = function(n) { return n < 10 ? '0' + n : n; };
			if(m === 60) {
				h++;
				m = 0;
			}
			if(h === 24) {
				d++;
				h = 0;
			}
			return `${d}d ${pad(h)}h ${pad(m)}m`;
		}

		const uptime = dhm(Client.uptime);

		const binfoButtons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setURL('https://discord.gg/jgzXHkU')
					.setLabel('Support')
					.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
					.setURL('https://github.com/Klarp/Accela.P')
					.setLabel('GitHub')
					.setStyle(ButtonStyle.Link),
			);

		const infoEmbed = new EmbedBuilder()
			.setAuthor({ name: bot.username, iconURL: bot.displayAvatarURL() })
			.setColor(0x0000FF)
			.setDescription(`**Prefix:** ${prefix}
**Help Command:** ${prefix}help
**Total Servers:** ${Client.guilds.cache.size} (${userCount} users)
			
**Uptime:** ${uptime}
			
**Roles:** ${roles}`)
			.setFooter({ text: `Created by: Klarp | Version: ${version} | Framework: discord.js ${discordjsVersion}` });
		message.channel.send({ embeds: [infoEmbed], components: [binfoButtons] });
	},
};