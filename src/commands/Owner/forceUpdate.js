module.exports = {
	name: 'forceupdate',
	description: 'Forces the bot to update the ranks of all verified users',
	module: 'Owner',
	owner: true,
	async execute(message) {
		message.client.updateRanks();
	},
};