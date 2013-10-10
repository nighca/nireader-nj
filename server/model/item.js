var db = require('../lib/data');

var tableName = 'item';
var struct = {
    title : 'string',
    link : 'longstring',
    description : 'text',
    author : 'string',
    content : 'longtext',
    pubDate : 'time',
    source : 'number'
};

db.initTable(tableName, struct, function(err, result){
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
        content: item.content,
        pubDate: item.pubDate || item.pubdate,
        source: source
    });
    //console.log("Create Item From Feed: " + item.title);//---------------------
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

var selectItem = function(options, callback, sort){
    sort = sort || {
        order: 'pubDate',
        descrease: true
    };
    db.selectItem(tableName, options, function(err, results){
        var items = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                items.push(createItem(results[i]));
            };
        }
        callback(err, items);
    }, sort);
};

var removeItem = function(options, callback){
    db.deleteItem(tableName, options, callback);
};

var ifExist = function(item, callback){
    selectItem({link: item.link}, function(err, items){
        if(err){
            callback && callback(err);
            return;
        }
        callback && callback(null, items.length > 0 ? items[0] : false);
    });
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

exports.tableName = tableName;
exports.struct = struct;
exports.ifExist = ifExist;
exports.select = selectItem;
exports.create = createItem;
exports.createFromFeed = createItemFromFeed;
exports.update = updateItem;
exports.remove = removeItem;
exports.save = saveItem;