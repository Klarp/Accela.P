// Copyright (C) 2023 Brody Jagoe

const { ChannelType } = require('discord.js');

module.exports = {
	checkPerm(user, perm, message) {
		if (message.channel.type === ChannelType.DM) return true;
		if (user.permissions.has(perm)) {
			return true;
		} else {
			return false;
		}
	},
	async getRankRole(member, rank, mode) {
		let role;
		if (mode === 0) {
			if (rank < 100 && rank !== 0) {
				// 1 - 99
				role = '754085973003993119';
			} else if (rank < 500) {
				// 100 - 499
				role = '754086188025118770';
			} else if (rank < 1000) {
				// 500 - 999
				role = '754086290785304627';
			} else if (rank < 5000) {
				// 1000 - 4999
				role = '754086299681685696';
			} else if (rank < 10000) {
				// 5000 - 9999
				role = '869294796404035675';
			} else if (rank < 25000) {
				// 10000 - 24999
				role = '869295190601531462';
			} else if (rank < 50000) {
				// 25000 - 49999
				role = '869295555489202217';
			} else if (rank < 100000) {
				// 50000 - 99999
				role = '754086107456471062';
			} else if (rank < 500000) {
				// 100000 - 499999
				role = '754089529287245855';
			} else {
				// 500000+
				role = '869295874306605066';
			}
		}

		// Taiko
		if (mode === 1) {
			if (rank < 100 && rank !== 0) {
				// 1 - 99
				role = '754087013904547930';
			} else if (rank < 500) {
				// 100 - 499
				role = '754087748209475595';
			} else if (rank < 1000) {
				// 500 - 999
				role = '754087814106448012';
			} else if (rank < 5000) {
				// 1000 - 4999
				role = '754087911066173460';
			} else if (rank < 10000) {
				// 5000 - 9999
				role = '754087679003721790';
			} else if (rank < 25000) {
				// 10000 - 24999
				role = '754089750717136906';
			} else if (rank < 50000) {
				// 25000 - 49999
				role = '869297047050784870';
			} else if (rank < 100000) {
				// 50000 - 99999
				role = '869297101086011483';
			} else if (rank < 500000) {
				// 100000 - 499999
				role = '869297132958531584';
			} else {
				// 500000+
				role = '869297154253017108';
			}
		}

		// Catch the Beat
		if (mode === 2) {
			if (rank < 100 && rank !== 0) {
				// 1 - 99
				role = '754087989717762080';
			} else if (rank < 500) {
				// 100 - 499
				role = '754088203534729276';
			} else if (rank < 1000) {
				// 500 - 999
				role = '754088281674743858';
			} else if (rank < 5000) {
				// 1000 - 4999
				role = '754088358916915241';
			} else if (rank < 10000) {
				// 5000 - 9999
				role = '754088053101953034';
			} else if (rank < 25000) {
				// 10000 - 24999
				role = '754089875157942435';
			} else if (rank < 50000) {
				// 25000 - 49999
				role = '869299174556987403';
			} else if (rank < 100000) {
				// 50000 - 99999
				role = '869299210883850280';
			} else if (rank < 500000) {
				// 100000 - 499999
				role = '869299235592478770';
			} else {
				// 500000+
				role = '869299254076792892';
			}
		}

		// Mania
		if (mode === 3) {
			if (rank < 100 && rank !== 0) {
				// 1 - 99
				role = '754086656889585714';
			} else if (rank < 500) {
				// 100 - 499
				role = '754086784484376596';
			} else if (rank < 1000) {
				// 500 - 999
				role = '754086852524507246';
			} else if (rank < 5000) {
				// 1000 - 4999
				role = '754086905825460265';
			} else if (rank < 10000) {
				// 5000 - 9999
				role = '754086720638681109';
			} else if (rank < 25000) {
				// 10000 - 24999
				role = '754089662242357289';
			} else if (rank < 50000) {
				// 25000 - 49999
				role = '869296510909689896';
			} else if (rank < 100000) {
				// 50000 - 99999
				role = '869296562881302528';
			} else if (rank < 500000) {
				// 100000 - 499999
				role = '869296602869801070';
			} else {
				// 500000+
				role = '869296657882300446';
			}
		}

		const roleList = [
			'754085973003993119',
			'754086188025118770',
			'754086290785304627',
			'754086299681685696',
			'869294796404035675',
			'869295190601531462',
			'869295555489202217',
			'754086107456471062',
			'754089529287245855',
			'869295874306605066',
			'754086656889585714',
			'754086784484376596',
			'754086852524507246',
			'754086905825460265',
			'754086720638681109',
			'754089662242357289',
			'869296510909689896',
			'869296562881302528',
			'869296602869801070',
			'869296657882300446',
			'754087013904547930',
			'754087748209475595',
			'754087814106448012',
			'754087911066173460',
			'754087679003721790',
			'754089750717136906',
			'869297047050784870',
			'869297101086011483',
			'869297132958531584',
			'869297154253017108',
			'754087989717762080',
			'754088203534729276',
			'754088281674743858',
			'754088358916915241',
			'754088053101953034',
			'754089875157942435',
			'869299174556987403',
			'869299210883850280',
			'869299235592478770',
			'869299254076792892',
		];

		roleList.forEach(r => {
			if (member.roles.cache.get(r)) {
				const rankRole = member.roles.cache.get(r).id;
				if (rankRole === role) return;
				member.roles.remove(r);
			}
		});
		member.roles.add(role);
	},
	timeSince(date) {
		const seconds = Math.floor((Date.now() - date) / 1000);

		let interval = Math.floor(seconds / 31536000);

		if (interval > 1) {
			return interval + ' years ago';
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return interval + ' months ago';
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return interval + ' days ago';
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return interval + ' hours ago';
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return interval + ' minutes ago';
		}
		return Math.floor(seconds) + ' seconds ago';
	},

	sleep(milliseconds) {
		const date = Date.now();
		let currentDate = null;
		do {
			currentDate = Date.now();
		} while (currentDate - date < milliseconds);
	},

	// Next and Prev Page for Multi-Page Commands
	nextPage(currentPage, pages) {
		if (currentPage + 1 === pages) {
			return 0;
		}
		currentPage += 1;
		return currentPage;
	},

	prevPage(currentPage, pages) {
		if (currentPage === 0) {
			return pages - 1;
		}
		currentPage -= 1;
		return currentPage;
	},
};