exports = module.exports = {
	db: {
		host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        charset: 'UTF8_GENERAL_CI',
        database: 'nireader'
	},
	feed: {
	},
	task: {
		//fetchInterval: 1000*60*60*24,
		fetchInterval: 1000*60*10,
		tryFetchTimes: 5
	}
};