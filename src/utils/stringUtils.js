// Copyright (C) 2023 Brody Jagoe

module.exports = {
	// Change string to title case
	titleCase: (str) => {
		str = str.toLowerCase().split(' ');
		for (let i = 0; i < str.length; i++) {
			str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
		}
		return str.join(' ');
	},

	// Calculate time since a date
	timeSince: (date) => {
		const intervals = [31536000, 2592000, 604800, 86400, 3600, 60].map(s => Math.floor((Date.now() - date) / (s * 1000)));
		const units = ['year', 'month', 'week', 'day', 'hour', 'minute'];

		// Find the index of the first non-zero interval
		const idx = intervals.findIndex(i => i > 0);

		return `${intervals[idx]} ${units[idx]}${intervals[idx] > 1 ? 's' : ''} ago`;
	},

	// Sleep function
	sleep: (ms) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	},

	// Format date
	formatDate: (year, month, day) => {
		const date = new Date(year, month - 1, day);
		const formattedDate = date.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
		return formattedDate;
	},
};
