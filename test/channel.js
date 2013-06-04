var Item = require('../model/item');
var Channel = require('../model/channel');
var log = require('../lib/log');

var item = Item.create({
    title: 'test item',
    link: 'http://nighca.me',
    description: 'for test',
    author: 'nighca',
    content: 'no content',
    pubDate: new Date(),
    source: 1
});

var channel = Channel.create({
    title: 'test channel',
    link: 'http://log.nighca.me',
    description: 'for test',

    language : 'Chinese',
    copyright : 'none',
    pubDate : new Date(),
    category : 'Test',
    generator : 'nodejs',
    webMaster : 'nighca@live.cn'
});

channel.items.push(item);

channel.save(function(){
    Item.select({}, function (err, results) {
        console.log(err);
        console.log(results);
    });
    Channel.select({}, function (err, results) {
        console.log(err);
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            results[i].remove();
        };
    });
});
