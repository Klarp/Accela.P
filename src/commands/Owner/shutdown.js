// Copyright (C) 2022 Brody Jagoe

const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { Client } = require('../../index');
const { owners, token } = require('../../../config.json');

module.exports = {
	name: 'shutdown',
	aliases: 'sd',
	description: 'Emergancy shutdown for the bot',
	module: 'Owner',
	owner: true,
	async execute(message) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('reset')
					.setLabel('Reset Bot')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('fullSD')
					.setLabel('Full Shutdown')
					.setStyle(ButtonStyle.Danger),
			);

		const sdEmbed = new EmbedBuilder()
			.setTitle('EMERGANCY SHUTDOWN ACTIVATED')
			.setDescription('Would you like to shut down the bot?');

		message.channel.send({ embeds: [sdEmbed], components: [row] }).then(msg => {
			const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

			collector.on('collect', async button => {
				if (!owners.includes(message.author.id)) return;

				if (button.customId === 'reset') {
					await button.deferUpdate();
					message.reply('Resetting...').then(async resetMessage => {
						await Client.destroy();
						await Client.login(token);
						await resetMessage.edit('Accela has restarted!');
					});
				} else if (button.customId === 'fullSD') {
					await button.deferUpdate();
					message.reply('Shutting down...').then(async () => {
						await Client.destroy();
					});
				}
			});
		});
	},
};