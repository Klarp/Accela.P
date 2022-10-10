module.exports = (serverConfig, DataTypes) => {
	return serverConfig.define('config', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			unique: false,
		},
		prefix: {
			type: DataTypes.STRING,
			unique: false,
		},
	},	{
		timestamps: false,
	});
};