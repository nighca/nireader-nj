var db = require('../lib/db');

db.initTable('article', {
	title: 'string',
	content: 'longtext'
}, function(err, results){
	if(err){
		console.log('INIT TABLE article', err);
		return;
	}
	db.insertItem('article', {
		title: 'test1',
		content: 'test-content1'
	}, function (err, results) {
		console.log('insert1: \n', err, results);

		db.selectItem('article', {title: 'test2'}, function(err, results){
			console.log('select1: \n', err, results);
			db.deleteItem('article', {
				title: 'test2'
			}, function(err, results){
				console.log('delete: \n', err, results);
				db.insertItem('article', {
					title: 'test2',
					content: 'test-content2'
				}, function (err, results) {
					console.log('insert2: \n', err, results);
				});
			});
		});
	});

	db.insertItems('article', [{title: 'item1'},{title: 'item2'}], function(err, results){
		if(err){
			console.log(err);
		}
		db.selectItem('article', {}, function(err, results){
			console.log('select2: \n', err, results);

			db.deleteItem('article', null, function(err, results){
				if(err){
					console.log(err);
				}
				process.exit();
			});
		});
	});
});

