var db = require('../lib/db');
var feed = require('../lib/feed');
var Item = require('./item');

var tableName = 'channel';

db.initTable(tableName, {
    title : 'string',
    link : 'longstring',
    source : 'longstring',
    description : 'text',

    language : 'string',
    copyright : 'string',
    pubDate : 'time',
    lastFetchDate : 'time',
    category : 'string',
    generator : 'string',
    webMaster : 'string'
}, function(err, result){
    if(err){
        console.log('INIT TABLE ' + tableName, err);
    }
});

function Channel (options) {
    this.id = options.id || null; 
    this.title = options.title || null; 
    this.link = options.link || null; 
    this.source = options.source || null; 
    this.description = options.description || null; 

    this.language = options.language || null; 
    this.copyright = options.copyright || null; 
    this.lastFetchDate = options.lastFetchDate || null; 
    this.category = options.category || null;
    this.generator = options.generator || null;
    this.webMaster = options.webMaster || null;
}


var createChannel = function(options){
    return new Channel(options);
};

var createChannelFromMeta = function(meta){
    return createChannel({
        title : meta.title,
        link : meta.link,
        source: meta.xmlurl || meta.xmlUrl,
        description : meta.description,

        language : meta.language,
        copyright : meta.copyright,
        pubDate : meta.pubDate || meta.pubdate,
        category : meta.category,
        generator : meta.generator,
        webMaster : meta.webMaster
    });
};

var updateChannel = function(channel, callback){
    db.updateItem(tableName, channel, callback);
};

var saveChannel = function(channel, callback){
    db.insertItem(tableName, channel, function(err, result){
        if(!err){
            channel.id = result.insertId;
        }
        callback && callback(err, channel);
    });
};

var selectChannel = function(options, callback){
    db.selectItem(tableName, options, function(err, results){
        var channels = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                channels.push(createChannel(results[i]));
            };
        }
        callback(err, channels);
    });
};

var removeChannel = function(options, callback){
    db.deleteItem(tableName, options, callback);
};

Channel.prototype.save = function(callback) {
    var channel = this;
    if(channel.id){
        updateChannel(channel, callback);
    }else{
        saveChannel(channel, callback);
    }
};

Channel.prototype.remove = function(callback) {
    var channel = this;
    if(!channel.id){
        callback && callback('ID not assigned.');
        return;
    }
    removeChannel({id: channel.id}, callback);
};

var useItem = function(item, channel){
    if(!channel.lastFetchDate){
        return true;
    }
    return item.pubDate > channel.lastFetchDate;
};
Channel.prototype.updateFromMeta = function(meta){
    var channel = this;
    channel.title = meta.title || channel.title;
    channel.link = meta.link || channel.link;
    channel.source = meta.xmlurl || meta.xmlUrl || channel.source;
    channel.description = meta.description || channel.description;

    channel.language = meta.language || channel.language;
    channel.copyright = meta.copyright || channel.copyright;
    channel.pubDate = meta.pubDate || meta.pubdate || channel.pubDate;
    channel.lastFetchDate = channel.pubDate || new Date();
    channel.category = meta.category || channel.category;
    channel.generator = meta.generator || channel.generator;
    channel.webMaster = meta.webMaster || channel.webMaster;

    return channel;
};
Channel.prototype.fetch = function(callback) {
    var channel = this;
    console.log("Channel fetch: " + channel.title);//---------------------------------
    if(!channel.source){
        callback && callback("no source assigned.")
        return;
    }
    if(!channel.id){
        callback && callback('ID not assigned.');
        return;
    }
    feed.parseRemote(channel.source, function(err, result){
        if(err){
            callback && callback(err);
            return;
        }

        var items = result.items;
        var item;

        var notFinished = 0;
        for (var i = 0, l = items.length; i < l; i++) {
            item = items[i];
            console.log("Get Item: " + item.title);//---------------------
            if(useItem(item, channel)){
                notFinished++;
                console.log("Use Item: " + item.title);//---------------------
                Item.createFromFeed(item, channel.id).save(function(err){
                    if(err){
                        console.error(err);
                    }
                    notFinished--;
                    if(!notFinished){
                        channel.updateFromMeta(result.meta).save();
                        callback && callback(null, channel);
                    }
                });
            }
        }
        if(!notFinished){
            channel.updateFromMeta(result.meta).save();
            callback && callback(null, channel);
        }
    });
};

Channel.prototype.getItems = function(callback) {
    var channel = this;
    if(!channel.id){
        callback && callback('ID not assigned.');
        return;
    }
    db.selectItem('item', {source: channel.id}, function(err, results){
        var items = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                items.push(Item.create(results[i]));
            }
        }
        callback && callback(err, items);
    });
};

Channel.prototype.cleanItems = function(callback) {
    var channel = this;
    if(!channel.id){
        callback && callback('ID not assigned.');
        return;
    }
    db.deleteItem('item', {source: channel.id}, callback);
};

exports.select = selectChannel;
exports.create = createChannel;
exports.createFromMeta = createChannelFromMeta;
exports.update = updateChannel;
exports.remove = removeChannel;
exports.save = saveChannel;
