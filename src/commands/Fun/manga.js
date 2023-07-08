// Copyright (C) 2023 Brody Jagoe

const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const anilist_node = require('anilist-node');
const aniList = new anilist_node();

module.exports = {
	name: 'manga',
	description: 'Displays information about requested manga',
	module: 'Fun',
	cooldown: 5,
	args: true,
	usage: '[manga]',
	execute(message, args) {
		const mangaName = args.join(' ');
		const mangaFilter = {
			isAdult: false,
		};

		const toTitleCase = str => {
			return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		function formatDate(year, month, day) {
			const date = new Date(year, month - 1, day);
			const formattedDate = date.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
			return formattedDate;
		}

		aniList.searchEntry.manga(mangaName, mangaFilter, 1, 5).then(mangaData => {
			if (mangaData.media.length === 0) {
				return message.reply('No results found');
			}

			aniList.media.manga(mangaData.media[0].id).then(manga => {
				let englishTitle = manga.title.english ? manga.title.english : '';
				let romajiTitle = manga.title.romaji ? manga.title.romaji : '';
				let nativeTitle = manga.title.native ? manga.title.native : '';
				let status = manga.status ? toTitleCase(manga.status) : 'Unknown';
				let format = manga.format ? manga.format : 'Unknown';
				let volumes = manga.volumes ? manga.volumes : 'Unknown';
				let chapters = manga.chapters ? manga.chapters : 'Unknown';
				let staffNames = manga.staff.length > 0 ? manga.staff.map(staff => `[${staff.name}](https://anilist.co/staff/${staff.id})`).join(', ') : 'Unknown';
				let avgScore = manga.averageScore ? `${manga.averageScore}%` : 'Unknown';
				let genres = manga.genres.length > 0 ? manga.genres.join(' | ') : 'Unknown';
				let startDate = manga.startDate.day && manga.startDate.month && manga.startDate.year ? formatDate(manga.startDate.year, manga.startDate.month, manga.startDate.day) : 'Unknown';
				let endDate = manga.endDate.day && manga.endDate.month && manga.endDate.year ? formatDate(manga.endDate.year, manga.endDate.month, manga.endDate.day) : 'Unknown';
				let description = manga.description ? manga.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').substring(0, 300) + '...' : 'No description available';

				let mangaEmbed = new EmbedBuilder()
					.setAuthor({ name: 'AniList [Unoffical]', url: 'https://anilist.co', iconURL: 'https://anilist.co/img/icons/android-chrome-512x512.png' })
					.setColor('#02A9FF')
					.setTitle(`${romajiTitle} [${nativeTitle}]`)
					.setURL(manga.siteUrl)
					.setThumbnail(manga.coverImage.large)
					.setDescription(`${englishTitle}
		
**Status:** ${status} | **Format:** ${format} | **Average Score:** ${avgScore}
**Staff:** ${staffNames} 
**Genres:** ${genres}

**Volumes:** ${volumes} | **Chapters:** ${chapters}
		
**Start Date:** ${startDate}
**End Date:** ${endDate}
		
**Description**
${description}`);
				const mangaMenu = [];
				for (let i = 0; i < mangaData.media.length; i++) {
					const menu = new StringSelectMenuOptionBuilder()
						.setLabel(mangaData.media[i].title.romaji)
						.setValue(`page_${i + 1}`)
						.setDescription(mangaData.media[i].title.english ? mangaData.media[i].title.english : mangaData.media[i].title.native);
					mangaMenu.push(menu);
				}

				const mangaMenuRow = new ActionRowBuilder()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('manga_menu')
							.setPlaceholder('More Results')
							.addOptions(mangaMenu),
					);

				message.reply({ embeds: [mangaEmbed], components: [mangaMenuRow] }).then(msg => {
					const filter = i => i.customId === 'manga_menu' && i.user.id === message.author.id;
					const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'manga_menu') {
							const page = parseInt(i.values[0].split('_')[1]) - 1;
							const mangaSelected = mangaData.media[page];

							aniList.media.manga(mangaSelected.id).then(async newManga => {
								englishTitle = newManga.title.english ? newManga.title.english : '';
								romajiTitle = newManga.title.romaji ? newManga.title.romaji : '';
								nativeTitle = newManga.title.native ? newManga.title.native : '';
								status = newManga.status ? toTitleCase(newManga.status) : 'Unknown';
								volumes = newManga.volumes ? newManga.volumes : 'Unknown';
								chapters = newManga.chapters ? newManga.chapters : 'Unknown';
								format = newManga.format ? newManga.format : 'Unknown';
								staffNames = newManga.staff.length > 0 ? newManga.staff.map(staff => `[${staff.name}](https://anilist.co/staff/${staff.id})`).join(', ') : 'Unknown';
								avgScore = newManga.averageScore ? `${newManga.averageScore}%` : 'Unknown';
								genres = newManga.genres.length > 0 ? newManga.genres.join(' | ') : 'Unknown';
								startDate = newManga.startDate.day && newManga.startDate.month && newManga.startDate.year ? formatDate(newManga.startDate.year, newManga.startDate.month, newManga.startDate.day) : 'Unknown';
								endDate = newManga.endDate.day && newManga.endDate.month && newManga.endDate.year ? formatDate(newManga.endDate.year, newManga.endDate.month, newManga.endDate.day) : 'Unknown';
								description = newManga.description ? newManga.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').substring(0, 300) + '...' : 'No description available';

								mangaEmbed = new EmbedBuilder()
									.setAuthor({ name: 'AniList [Unoffical]', url: 'https://anilist.co', iconURL: 'https://anilist.co/img/icons/android-chrome-512x512.png' })
									.setColor('#02A9FF')
									.setTitle(`${romajiTitle} [${nativeTitle}]`)
									.setURL(newManga.siteUrl)
									.setThumbnail(newManga.coverImage.large)
									.setDescription(`${englishTitle}

**Status:** ${status} | **Format:** ${format} | **Average Score:** ${avgScore}
**Volumes** ${volumes} | **Chapters:** ${chapters}
**Staff:** ${staffNames}
**Genres:** ${genres}

**Start Date:** ${startDate}
**End Date:** ${endDate}

**Description**
${description}`);

								await i.update({ embeds: [mangaEmbed] });
							}).catch(async err => {
								console.error(err);
								await i.update({ content: 'An error occured while fetching the manga.' });
							});
						}
					});
					collector.on('end', async () => {
						await msg.edit({ components: [] });
					});
				}).catch(async err => {
					console.error(err);
					await message.reply('An error occured while fetching the manga.');
				});
			});
		});
	},
};