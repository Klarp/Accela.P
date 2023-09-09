// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const anilist_node = require('anilist-node');
const aniList = new anilist_node();
const { titleCase, formatDate } = require('../../utils/stringUtils');

module.exports = {
	name: 'anime',
	aliases: 'ani',
	description: 'Displays information about requested anime',
	module: 'Fun',
	cooldown: 5,
	args: true,
	usage: '[anime]',
	execute(message, args) {
		const animeName = args.join(' ');
		const animeFilter = {
			isAdult: false,
		};

		aniList.searchEntry.anime(animeName, animeFilter, 1, 5).then(animeData => {
			if (animeData.media.length === 0) {
				return message.reply('No results found');
			}

			aniList.media.anime(animeData.media[0].id).then(anime => {
				let englishTitle = anime.title.english ? anime.title.english : '';
				let romajiTitle = anime.title.romaji ? anime.title.romaji : '';
				let nativeTitle = anime.title.native ? anime.title.native : '';
				let status = anime.status ? titleCase(anime.status) : 'Unknown';
				let format = anime.format ? anime.format : 'Unknown';
				let episodes = anime.episodes ? anime.episodes : 'Unknown';
				let studioNames = anime.studios.map(studio => studio.isAnimationStudio ? `[${studio.name}](https://anilist.co/studio/${studio.id})` : '').filter(studio => studio !== '').join(', ');
				let avgScore = anime.averageScore ? `${anime.averageScore}%` : 'Unknown';
				let genres = anime.genres.length > 0 ? anime.genres.join(' | ') : 'Unknown';
				let startDate = anime.startDate.day && anime.startDate.month && anime.startDate.year ? formatDate(anime.startDate.year, anime.startDate.month, anime.startDate.day) : 'Unknown';
				let endDate = anime.endDate.day && anime.endDate.month && anime.endDate.year ? formatDate(anime.endDate.year, anime.endDate.month, anime.endDate.day) : 'Unknown';
				let description = anime.description ? anime.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').substring(0, 300) + '...' : 'No description available';

				let animeEmbed = new EmbedBuilder()
					.setAuthor({ name: 'AniList [Unoffical]', url: 'https://anilist.co', iconURL: 'https://anilist.co/img/icons/android-chrome-512x512.png' })
					.setColor('#02A9FF')
					.setTitle(`${romajiTitle} [${nativeTitle}]`)
					.setURL(anime.siteUrl)
					.setThumbnail(anime.coverImage.large)
					.setDescription(`${englishTitle}
		
**Status:** ${status} | **Format:** ${format} | **Episodes:** ${episodes}
**Studio:** ${studioNames} | **Average Score:** ${avgScore}
**Genres:** ${genres}
		
**Start Date:** ${startDate}
**End Date:** ${endDate}
		
**Description**
${description}`);
				const animeMenu = [];
				for (let i = 0; i < animeData.media.length; i++) {
					const menu = new StringSelectMenuOptionBuilder()
						.setLabel(animeData.media[i].title.romaji)
						.setValue(`page_${i + 1}`)
						.setDescription(animeData.media[i].title.english ? animeData.media[i].title.english : animeData.media[i].title.native);
					animeMenu.push(menu);
				}

				const animeMenuRow = new ActionRowBuilder()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('anime_menu')
							.setPlaceholder('More Results')
							.addOptions(animeMenu),
					);

				message.reply({ embeds: [animeEmbed], components: [animeMenuRow] }).then(msg => {
					const filter = i => i.customId === 'anime_menu' && i.user.id === message.author.id;
					const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'anime_menu') {
							const page = parseInt(i.values[0].split('_')[1]) - 1;
							const animeSelected = animeData.media[page];

							aniList.media.anime(animeSelected.id).then(async newAnime => {
								englishTitle = newAnime.title.english ? newAnime.title.english : '';
								romajiTitle = newAnime.title.romaji ? newAnime.title.romaji : '';
								nativeTitle = newAnime.title.native ? newAnime.title.native : '';
								status = newAnime.status ? titleCase(newAnime.status) : 'Unknown';
								format = newAnime.format ? newAnime.format : 'Unknown';
								episodes = newAnime.episodes ? newAnime.episodes : 'Unknown';
								studioNames = newAnime.studios.map(studio => studio.isAnimationStudio ? `[${studio.name}](https://anilist.co/studio/${studio.id})` : '').filter(studio => studio !== '').join(', ');
								avgScore = newAnime.averageScore ? `${newAnime.averageScore}%` : 'Unknown';
								genres = newAnime.genres.length > 0 ? newAnime.genres.join(' | ') : 'Unknown';
								startDate = newAnime.startDate.day && newAnime.startDate.month && newAnime.startDate.year ? formatDate(newAnime.startDate.year, newAnime.startDate.month, newAnime.startDate.day) : 'Unknown';
								endDate = newAnime.endDate.day && newAnime.endDate.month && newAnime.endDate.year ? formatDate(newAnime.endDate.year, newAnime.endDate.month, newAnime.endDate.day) : 'Unknown';
								description = newAnime.description ? newAnime.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').substring(0, 300) + '...' : 'No description available';

								animeEmbed = new EmbedBuilder()
									.setAuthor({ name: 'AniList [Unoffical]', url: 'https://anilist.co', iconURL: 'https://anilist.co/img/icons/android-chrome-512x512.png' })
									.setColor('#02A9FF')
									.setTitle(`${romajiTitle} [${nativeTitle}]`)
									.setURL(newAnime.siteUrl)
									.setThumbnail(newAnime.coverImage.large)
									.setDescription(`${englishTitle}

**Status:** ${status} | **Format:** ${format} | **Episodes:** ${episodes}
**Studio:** ${studioNames} | **Average Score:** ${avgScore}
**Genres:** ${genres}

**Start Date:** ${startDate}
**End Date:** ${endDate}

**Description**
${description}`);

								await i.update({ embeds: [animeEmbed] });
							}).catch(async err => {
								console.error(err);
								await i.update({ content: 'An error occured while fetching the anime.' });
							});
						}
					});
					collector.on('end', async () => {
						await msg.edit({ components: [] });
					});
				}).catch(async err => {
					console.error(err);
					await message.reply('An error occured while fetching the anime.');
				});
			});
		});
	},
};