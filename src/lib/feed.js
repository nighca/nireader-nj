var FeedParser = require('feedparser');
var request = require('request');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

var log = require('./log');

var options = require("../../config").feed;

var encodeMap = {
    'UTF-8': 'utf8',
    'default': 'utf8'
};

var parse = function(stream, callback){
    var cnt = {
        items: []
    };

    var code, decoder;

    var dealError = function(error){
        callback && callback(error);
    };
    
    var dealMeta = function(meta){
        cnt.meta = meta;
        code = meta['#xml']['encoding'];
        decoder = new StringDecoder(encodeMap[code] || encodeMap['default']);
    };

    var dealArticle = function(article){
        article.content = (article.content && article.content['#']) || 
            (article['content:encoded'] && article['content:encoded']['#']) || 
            article.description || 
            article.summary || 
            '';
        if(decoder){
            article.content = decoder.write(article.content);
        }

        cnt.items.push(article);
    };

    var dealEnd = function(){
        callback(null, cnt);
    };

    var parser = stream.pipe(new FeedParser(options));
    parser.on('error', dealError);
    parser.on('meta', dealMeta);
    parser.on('article', dealArticle);
    parser.on('end', dealEnd);
};

var parseRemote = function(url, callback){
    var stream = request(url);
    stream.on('error', callback);
    parse(stream, callback);
};

var parseLocal = function(path, callback){
    var stream = fs.createReadStream(path);
    stream.on('error', callback);
    parse(stream, callback);
};

var getMetaRemote = function(url, callback){
    var stream = request(url);
    stream.on('error', callback);
    var parser = stream.pipe(new FeedParser(options));
    parser.on('error', function(err){
        callback(err);
    });
    parser.on('meta', function(meta){
        callback(null, meta);
    });
};

var getItemsRemote = function(url, callback){
    var items = [];
    var stream = request(url);
    stream.on('error', callback);
    var parser = stream.pipe(new FeedParser(options));
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

