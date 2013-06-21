var db = require('../lib/db');

var tableName = 'item';

db.initTable(tableName, {
    title : 'string',
    link : 'longstring',
    description : 'text',
    author : 'string',
    content : 'longtext',
    pubDate : 'time',
    source : 'number'
}, function(err, result){
    if(err){
        console.log('INIT TABLE ' + tableName, err);
    }
});

function Item (options) {
    this.id = options.id || null; 
    this.title = options.title || null; 
    this.link = options.link || null; 
    this.description = options.description || null; 
    this.author = options.author || null; 
    this.content = options.content || null; 
    this.pubDate = options.pubDate || null; 
    this.source = options.source || null;
}

var createItem = function(options){
    return new Item(options);
};

var createItemFromFeed = function(item, source){
    item = createItem({
        title: item.title,
        link: item.link,
        description: item.description,
        author: item.author,
        content: (item.content && item.content['#']) || (item['content:encoded'] && item['content:encoded']['#']),
        pubDate: item.pubDate || item.pubdate,
        source: source
    });
    console.log(item);//-------------------------------------------
    return item;
};

var updateItem = function(item, callback){
    db.updateItem(tableName, item, callback);
};

var saveItem = function(item, callback){
    db.insertItem(tableName, item, function(err, result){
        if(!err){
            item.id = result.insertId;
        }
        callback && callback(err, item);
    });
};

var selectItem = function(options, callback){
    db.selectItem(tableName, options, function(err, results){
        var items = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                items.push(createItem(results[i]));
            };
        }
        callback(err, items);
    });
};

var removeItem = function(options, callback){
    db.deleteItem(tableName, options, callback);
};

Item.prototype.save = function(callback) {
    var item = this;
    if(item.id){
        updateItem(item, callback);
    }else{
        saveItem(item, callback);
    }
};

Item.prototype.remove = function(callback) {
    var item = this;
    if(!item.id){
        callback && callback('ID not assigned.');
        return;
    }
    removeItem({id: item.id}, callback);
};

exports.select = selectItem;
exports.create = createItem;
exports.createFromFeed = createItemFromFeed;
exports.update = updateItem;
exports.remove = removeItem;
exports.save = saveItem;
