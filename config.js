exports = module.exports = {
	db: {
		host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'nireader'
	},
	feed: {
	},
	task: {
		fetchInterval: 1000*60*60*24,
		tryFetchTimes: 5
	}
};