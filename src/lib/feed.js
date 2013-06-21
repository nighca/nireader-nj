var FeedParser = require('feedparser');
var request = require('request');
var fs = require('fs');

var log = require('./log');

var options = require("../../config").feed;

var parse = function(stream, callback){
    var cnt = {
        items: []
    };

    var dealError = function(error){
        callback && callback(error);
    };

    var dealMeta = function(meta){
        cnt.meta = meta;
    };

    var dealArticle = function(article){
        cnt.items.push(article);
    };

    var dealEnd = function(){
        callback(null, cnt);
    };

    stream.pipe(new FeedParser(options))
        .on('error', dealError)
        .on('meta', dealMeta)
        .on('article', dealArticle)
        .on('end', dealEnd);
};

var parseRemote = function(url, callback){
    parse(request(url), callback);
};

var parseLocal = function(path, callback){
    parse(fs.createReadStream(path), callback);
};

var getMetaRemote = function(url, callback){
    var parser = request(url).pipe(new FeedParser(options));
    parser.on('error', function(err){
        callback(err);
    });
    parser.on('meta', function(meta){
        callback(null, meta);
    });
};

var getItemsRemote = function(url, callback){
    var items = [];
    var parser = request(url).pipe(new FeedParser(options));
    parser.on('error', function(err){
        callback(err);
    });
    parser.on('article', function(article){
        items.push(article);
    });
    parser.on('end', function(){
        callback(null, items);
    });
};

exports.parseRemote = parseRemote;
exports.getMetaRemote = getMetaRemote;
exports.getItemsRemote = getItemsRemote;

//parseLocal有错
//exports.parseLocal = parseLocal;

