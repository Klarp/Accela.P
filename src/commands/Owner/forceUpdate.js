module.exports = {
	name: 'forceupdate',
	description: 'Forces the bot to update the ranks of all verified users',
	module: 'Owner',
	owner: true,
	async execute(message) {
		console.log(typeof message.client.updateRanks);
		try {
			console.log('Forceupdate command called');
			await message.client.updateRanks();
			console.log('Forceupdate command executed successfully');
		} catch (error) {
			console.error('Error executing forceupdate command:', error);
		}
	},
};
