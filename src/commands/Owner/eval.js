// Copyright (C) 2023 Brody Jagoe

const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const { Client } = require('../../index');

function formatCode(lang, eCode) {
	const formattedCode = (`\`\`\`${lang}\n${String(eCode).slice(0, 1000) + (eCode.length >= 1000 ? '...' : '')}\n\`\`\``);
	return formattedCode.replace(Client.token, '*'.repeat(Client.token.length));
}

module.exports = {
	name: 'eval',
	description: 'Runs client side code',
	module: 'Owner',
	owner: true,
	args: true,
	usage: '<code>',
	async execute(message, args) {
		const channel = message.channel;
		const query = args.join(' ');
		const evalEmbed = new MessageEmbed();

		try {
			const evald = eval(query);
			const res = typeof evald === 'string' ? evald : inspect(evald, { depth: 0 });

			evalEmbed
				.addFields({ name: 'Result', value: formatCode('js', res) })
				.setColor(!res || (!evald && evald !== 0) ? 0xff0000 : 0x00FF00);

			if (res || (evald || evald === 0)) {
				evalEmbed.addFields({ name: 'Type', value: formatCode('css', typeof evald) });
			}
		} catch (error) {
			evalEmbed
				.addFields({ name: 'Error', value: formatCode('js', error) })
				.setColor(0xff0000);
		} finally {
			try {
				await channel.send({ embeds: [evalEmbed] });
			} catch (error) {
				channel.send(`Error: ${error.message}`);
			}
		}
	},
};
