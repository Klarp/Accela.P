// Copyright (C) 2022 Brody Jagoe

const { Collection, EmbedBuilder, ChannelType } = require('discord.js');
const { Client } = require('../index');
const { owners } = require('../../config.json');
const { checkPerm } = require('../utils');

const cooldowns = new Collection();

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		// if (!servers.includes(message.guildId)) return;
		if (message.webhookID) return;

		let serverConfig;

		let prefix = '>>';

		if (serverConfig) {
			prefix = serverConfig.get('prefix');
		}

		if (message.author.bot) return;

		const mentionTest = message.content.split(' ');

		// Needs fixing
		if (mentionTest[0] === `<@!${Client.user.id}>` && !mentionTest[1]) {
			message.channel.send(`Hello, my current prefix is: \`${prefix}\` if you need help use \`${prefix}help\` for more information.`);
		}

		if (!message.content.startsWith(prefix)) return;

		/*
		// For beta testing
		if (message.channel.type === ChannelType.GuildText) {
			if (message.channel.guild.id === '98226572468690944') return;
		}
		*/

		// Channel lock for beta testing
		/*
		if (message.channel.type === ChannelType.GuildText) {
			if (message.channel.guild.id === '98226572468690944') {
				if (message.channel.id !== '277163440999628800') return;
			}
		}
		*/

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		// Stop if no command
		if (!commandName) return;

		// Find command or it's aliases
		const command = Client.commands.get(commandName)
		|| Client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Stop if a command wasn't found
		if (!command) return;

		// Private Test
		// if (message.author.id !== '186493565445079040') return;

		// If command is owner only check if user is owner
		if (command.owner) {
			if (!owners.includes(message.author.id)) return;
		}

		// If command has permissions check user permissions
		if (command.perms) {
			console.log(checkPerm(message.member, command.perms, message));
			if (checkPerm(message.member, command.perms, message)) return;
		}

		// Stop if a command can't be run inside DMs
		if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
			console.log(message.channel.type);
			return message.reply('I can only execute this command in guild text channels!');
		}

		if (command.disableOsu && message.channelId === '98226572468690944') return;

		// Error if a command that should get arguments receives none
		if (command.args && !args.length) {
			let reply = `You didn't put any arguments, ${message.author}!`;
			// If command has a set usage display it
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		// COOLDOWN START

		// Set the cooldown after the command is run
		if(!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		// Current date
		const now = Date.now();
		// List of people who used the command
		const timestamps = cooldowns.get(command.name);
		// Get the command cooldown or default to 3 seconds
		const cooldownAmount = (command.cooldown || 3) * 1000;

		// If user recently used the command return if cooldown hasn't ended
		if (timestamps.has(message.author.id)) {
		// Find the expiration time
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			// If the expiration time isn't up reply the cooldown time
			if (now < expirationTime && !owners.includes(message.author.id)) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
		}

		// Stop the cooldown once it ends
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Attempt to execute the command
		try {
			command.execute(message, args);
		} catch (error) {
		// If failed to execute console log the error
			console.error(error);
			// Creation of error embed
			const errorEmbed = new EmbedBuilder()
				.setTitle('An Error Has Occurred')
				.setColor(0xFF0000)
				.setDescription(`OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!
			
Please do not contact @Klarp#0001 if you see this message`);
			// Sends error embed on command failure
			message.channel.send({ embeds: [errorEmbed] });
		}
	},
};