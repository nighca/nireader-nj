var feed = require('../src/lib/feed');

feed.parseRemote('http://nighca.me/feed/', function (err, result) {
	console.log("Remote: \n", result.meta, result.items.length);
});

feed.getMetaRemote('http://nighca.me/feed/', function (err, result) {
	console.log("Meta: \n", result);
});

feed.getItemsRemote('http://nighca.me/feed/', function (err, items) {
	console.log("Items: \n", items.length);
});