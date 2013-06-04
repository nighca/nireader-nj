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

Item.prototype.save = function(callback) {
    var item = this;
    if(item.id !== null){
        callback && callback('Already saved.');
        return;
    }
    db.insertItem(tableName, item, function(err, result){
        if(err){
            console.log('SAVE item', item, err);
            return;
        }
        item.id = result.insertId;
        callback && callback(null, item);
    });
};

Item.prototype.remove = function(callback) {
    var item = this;
    //console.log("remove ", item);//------------------------------------
    if(item.id === null){
        callback && callback('ID not assigned.');
        return;
    }
    db.deleteItem(tableName, {id: item.id}, function(err, results){
        if(err){
            console.log('REMOVE item', item, err);
        }
        callback && callback(err, null);
    });
};

exports.create = function(options){
    return new Item(options);
};

var selectItems = function(options, callback){
    db.selectItem(tableName, options, function(err, results){
        if(err){
            callback && callback(err, null);
            return;
        }
        var items = [];
        for (var i = 0, l = results.length; i < l; i++) {
            items.push(new Item(results[i]));
        };
        callback(null, items);
    });
};

exports.select = selectItems;