var db = require('../lib/db');

db.init(function () {
	/*db.insertItem('article', {
		title: 'test1',
		content: 'test-content1'
	}, function (err, results) {
		console.log('insert1: \n', err, results);

		db.selectItem('article', {title: 'test2'}, function(err, results){
			console.log('select: \n', err, results);
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
	});*/
	for (var i = 10; i >= 0; i--) {
		db.insertItem('article', {
			title: 'test' + i,
			content: 'test-content'
		}, function(err, results){
			if(err){
				console.log("!");
			}
		});
	}
});

