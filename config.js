exports = module.exports = {
	db: {
		host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'nireader'
	},
	tables: {
	    'article': {
	        title : 'string',
	        content : 'text',
	        url : 'string'
	    }
	}
};