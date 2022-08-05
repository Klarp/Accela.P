// Copyright (C) 2022 Brody Jagoe

const { EmbedBuilder } = require('discord.js');
const { inspect } = require('util');
const { Client } = require('../../index');

module.exports = {
	name: 'eval',
	description: 'Runs client side code',
	module: 'Owner',
	owner: true,
	args: true,
	usage: '<code>',
	execute(message, args) {
		const channel = message.channel;
		const query = args.join(' ');
		const evalEmbed = new EmbedBuilder();
		const code = (lang, eCode) =>
			(`\`\`\`${lang}\n${String(eCode).slice(0, 1000) + (eCode.length >= 1000 ? '...' : '')}\n\`\`\``).replace(Client.token, '*'.repeat(Client.token.length));

		try {
			const evald = eval(query);
			const res = typeof evald === 'string' ? evald : inspect(evald, { depth: 0 });

			evalEmbed
				.addFields({ name:'Result', value: code('js', res) });

			if (!res || (!evald && evald !== 0)) {
				evalEmbed.setColor('#ff0000');
			} else {
				evalEmbed
					.addFields({ name: 'Type', value: code('css', typeof evald) })
					.setColor('#00FF00');
			}
		} catch (error) {
			evalEmbed
				.addFields({ name: 'Error', value: code('js', error) })
				.setColor('#ff0000');
		} finally {
			channel.send({ embeds: [evalEmbed] }).catch(error => {
				channel.send(`Error: ${error.message}`);
			});
		}
	},
};