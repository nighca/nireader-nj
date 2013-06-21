var Item = require('../src/model/item');
var Channel = require('../src/model/channel');
var log = require('../src/lib/log');

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
    source: 'http://log.nighca.me/feed/',
    description: 'for test',

    language : 'Chinese',
    copyright : 'none',
    pubDate : new Date(),
    category : 'Test',
    generator : 'nodejs',
    webMaster : 'nighca@live.cn'
});

/*channel.save(function(){
    item.source = channel.id;
    item.save(function(){
        Item.select({}, function (err, results) {
            console.log(err);
            console.log(results);
        });
        Channel.select({}, function (err, results) {
            console.log(err);
            console.log(results);
        });
        channel.getItems(function(err, items){
            console.log(err, items);
            channel.cleanItems(function(err, result){
                channel.remove();
            });
        });
    });
});*/

channel.save(function(){
    channel.fetch(function(err, channel){
        if(err){
            console.error(err);
        }
        console.log("!", channel);
    });
})