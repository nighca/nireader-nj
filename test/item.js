var Item = require('../src/model/item');

var item = Item.create({
    title: 'test item',
    link: 'http://nighca.me',
    description: 'for test',
    author: 'nighca',
    content: 'no content',
    pubDate: new Date(),
    source: 1
});

item.save(function(){
    item.title += ' update!';
    item.save(function(){
        Item.select({}, function (err, results) {
            console.log(err);
            console.log(results);
            item.remove();
            process.exit();
        });
    });
});
