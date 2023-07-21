const { EmbedBuilder } = require('discord.js');
const Sentry = require('../../log');

module.exports = {
	// Function to handle errors for osu commands
	handleError: (error, message, name) => {
		if (error.name === 'Error') {
			return message.reply(`No user was found named ${name}!`);
		}
		Sentry.captureException(error);
		console.error(error);
		return message.reply('An error has occurred!');
	},

	// Send embed for osu commands
	sendEmbedMessage: async function(user, verified, message, mode, name) {
		const { rank, countryRank: crank, raw: pp } = user.pp;
		const { plays: playCount } = user.counts;
		const { level, accuracyFormatted: acc, country, name: osuName, id: userId, raw_joinDate } = user;
		const joinDate = raw_joinDate.split(' ')[0];

		const osuEmbed = new EmbedBuilder()
			.setAuthor({ name: osuName || name, iconURL: `http://a.ppy.sh/${userId}`, url: `https://osu.ppy.sh/u/${userId}` })
			.setColor(0xaf152a)
			.setTitle(`Information On ${osuName}`)
			.setURL(`https://osu.ppy.sh/u/${userId}`)
			.setThumbnail(`http://a.ppy.sh/${userId}`)
			.setDescription(`**Level** ${Math.floor(level)} | **Global Rank** ${rank} | **:flag_${country.toLowerCase()}: Rank** ${crank}

**PP** ${Math.round(pp)} | **Accuracy** ${acc || '0%'} | **Play Count** ${playCount || '0'}

${verified}`)
			.setFooter({ text: `osu!${mode} • Joined ${joinDate}` });

		await message.channel.send({ embeds: [osuEmbed] });
	},
};