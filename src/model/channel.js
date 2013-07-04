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

var all;
var refreshAll = function(){
    selectChannel({}, function(err, channels){
        if(!err){
            all = channels;
        }
    });
};
refreshAll();
function getAllChannel(callback){
    if(!all){
        selectChannel({}, callback);
    }else{
        callback(null, all);
    }
};

function createChannel(options){
    return new Channel(options);
};

function createChannelFromMeta(meta, xmlurl){
    return createChannel({
        title : meta.title,
        link : meta.link,
        source: meta.xmlurl || meta.xmlUrl || xmlurl,
        description : meta.description,

        language : meta.language,
        copyright : meta.copyright,
        pubDate : meta.pubDate || meta.pubdate,
        category : meta.category,
        generator : meta.generator,
        webMaster : meta.webMaster
    });
};

function updateChannel(channel, callback){
    db.updateItem(tableName, channel, function(err, result){
        refreshAll();
        callback && callback(err, channel);
    });
};

function saveChannel(channel, callback){
    db.insertItem(tableName, channel, function(err, result){
        if(!err){
            channel.id = result.insertId;
        }
        refreshAll();
        callback && callback(err, channel);
    });
};

function selectChannel(options, callback, sort){
    db.selectItem(tableName, options, function(err, results){
        var channels = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                channels.push(createChannel(results[i]));
            };
        }
        callback(err, channels);
    }, sort);
};

function ifExist(channel, callback){
    selectChannel({source: channel.source}, function(err, channels){
        if(err){
            callback && callback(err);
            return;
        }
        if(channels.length>0){
            callback && callback('already exist');
            return;
        }
        callback && callback(null);
    });
};

function removeChannel(options, callback){
    db.deleteItem(tableName, options, function(err, result){
        refreshAll();
        callback && callback(err, channel);
    });
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
    //console.log("Channel fetch: " + channel.title);//---------------------------------
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
            //console.log("Get Item: " + item.title);//---------------------
            if(useItem(item, channel)){
                notFinished++;
                //console.log("Use Item: " + item.title);//---------------------
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
    var sort = {
        order: 'pubDate',
        descrease: true
    };
    if(!channel.id){
        callback && callback('ID not assigned.');
        return;
    }
    Item.select({source: channel.id}, callback, sort);
};

Channel.prototype.cleanItems = function(callback) {
    var channel = this;
    if(!channel.id){
        callback && callback('ID not assigned.');
        return;
    }
    Item.remove({source: channel.id}, callback);
};

exports.tableName = tableName;
exports.ifExist = ifExist;
exports.select = selectChannel;
exports.select = selectChannel;
exports.getAll = getAllChannel;
exports.create = createChannel;
exports.createFromMeta = createChannelFromMeta;
exports.update = updateChannel;
exports.remove = removeChannel;
exports.save = saveChannel;
