var Item = require('../model/item');

var item = Item.create({
    title: 'test item',
    content: 'no content',
    pubdate: new Date()
});

item.save(function(){
    Item.select({}, function (err, results) {
        console.log(err);
        console.log(results);
        item.remove();
    });
});
