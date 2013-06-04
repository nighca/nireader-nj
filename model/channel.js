var db = require('../lib/db');
var Item = require('./item');

var tableName = 'channel';

db.initTable(tableName, {
    title : 'string',
    link : 'longstring',
    description : 'text',

    language : 'string',
    copyright : 'string',
    pubDate : 'time',
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
    this.description = options.description || null; 

    this.language = options.language || null; 
    this.copyright = options.copyright || null; 
    this.pubDate = options.pubDate || null; 
    this.category = options.category || null;
    this.generator = options.generator || null;
    this.webMaster = options.webMaster || null;

    this.items = [];
}

Channel.prototype.save = function(callback) {
    var channel = this;
    if(channel.id !== null){
        callback && callback('Already saved.');
        return;
    }
    db.insertItem(tableName, channel, function(err, result){
        if(err){
            console.log('SAVE channel', channel, err);
            return;
        }
        channel.id = result.insertId;

        var notFinished = 0;
        for (var i = 0; i < channel.items.length; i++) {
            notFinished++;
            channel.items[i].source = channel.id;
            channel.items[i].save(function(){
                notFinished--;
                if(!notFinished){
                    callback && callback(null, channel);
                }
            });
        };
    });
};

Channel.prototype.remove = function(callback) {
    var channel = this;
    //console.log("remove ", channel);//------------------------------------
    if(channel.id === null){
        callback && callback('ID not assigned.');
        return;
    }
    db.deleteItem(tableName, {id: channel.id}, function(err, results){
        if(err){
            console.log('REMOVE channel', channel, err);
            return;
        }

        var notFinished = 0;
        for (var i = 0; i < channel.items.length; i++) {
            notFinished++;
            channel.items[i].remove(function(){
                notFinished--;
                if(!notFinished){
                    callback && callback(err, null);
                }
            });
        };
    });
};

Channel.prototype.loadItems = function(callback) {
    var channel = this;
    if(channel.id === null){
        callback && callback('ID not assigned.');
        return;
    }
    db.selectItem('item', {source: channel.id}, function(err, results){
        channel.items = [];
        for (var i = 0, l = results.length; i < l; i++) {
            channel.items.push(Item.create(results[i]));
        };
        callback && callback(null, channel.items);
    });
};

exports.create = function(options){
    return new Channel(options);
};

var selectChannels = function(options, callback){
    db.selectItem(tableName, options, function(err, results){
        if(err){
            callback && callback(err, null);
            return;
        }
        var channels = [];
        var notFinished = 0;
        for (var i = 0, l = results.length; i < l; i++) {
            notFinished++;
            var channel = new Channel(results[i]);
            channels.push(channel);
            channel.loadItems(function(){
                notFinished--;
                if(!notFinished){
                    callback && callback(null, channels);
                }
            });
        };
    });
};

exports.select = selectChannels;