// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, ChannelType } = require('discord.js');
const Sentry = require('../../../log');
const { prefix: defaultPrefix, owners } = require('../../../config.json');
const { hasPermission } = require('../../utils/discordUtils');
const { sConfig } = require('../../../database/dbObjects');

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

const isOwner = id => owners.includes(id);

const generateHelpEmbed = (client, prefix) => {
	return new EmbedBuilder()
		.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
		.setTitle('Command Directory')
		.addFields([
			{ name: 'osu!', value: `\`${prefix}help osu!\``, inline: true },
			{ name: 'Fun', value : `\`${prefix}help fun\``, inline: true },
			{ name: 'Utility', value: `\`${prefix}help utility\``, inline: true },
		])
		.setFooter({ text: `You can use ${prefix}help [command name] to get info on a specific command!` });
};

module.exports = {
	name: 'help',
	aliases: ['commands'],
	description: 'Lists all commands or info about a specific command',
	module: 'Utility',
	usage: '[command]',
	cooldown: 5,
	async execute(message, args) {
		const { client, channel, author } = message;
		const { commands } = client;
		let serverConfig;
		let prefix = defaultPrefix;

		if (channel.type === ChannelType.GuildText) {
			serverConfig = await sConfig.findOne({ where: { guild_id: message.guild.id } });
			if (serverConfig) {
				prefix = serverConfig.get('prefix');
			}
		}

		if (!args.length) {
			const helpEmbed = generateHelpEmbed(client, prefix);
			return channel.send({ embeds: [helpEmbed] });
		}

		const name = capitalizeFirstLetter(args[0].toLowerCase());
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			if (!isOwner(author.id) && name === 'Owner') return;

			const moduleCommands = commands.filter(c => c.module === name && (!c.perms || hasPermission(message.member, c.perms, message)) && (!c.owner || isOwner(author.id)));

			if (moduleCommands.length === 0) return;

			const data = [`**__${name} Commands__**\n`, ...moduleCommands.map(c => `**${c.name}**: ${c.description}`), '', `You can send \`${prefix}help [command name]\` to get info on a specific command!`];

			const helpEmbed = new EmbedBuilder()
				.setColor(0x0000FF)
				.setDescription(data.join('\n'));

			try {
				await author.send({ embeds: [helpEmbed] });
				if (channel.type !== ChannelType.DM) {
					message.reply('I\'ve sent you a DM with the commands!');
				}
			} catch (error) {
				console.error(error);
				Sentry.captureException(error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
			}
		} else {
			const commandEmbed = new EmbedBuilder()
				.setTitle(`${capitalizeFirstLetter(command.name)} Command`)
				.setDescription(`**Aliases:** ${command.aliases?.join(', ') || 'None'}

**Description:** ${command.description || 'None'}

**Category:** ${command.module || 'None'}

**Usage:** ${prefix}${command.name} ${command.usage || ''}

**Cooldown:** ${command.cooldown || 3} second(s)`);

			channel.send({ embeds: [commandEmbed] });
		}
	},
};
