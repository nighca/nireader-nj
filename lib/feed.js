var FeedParser = require('feedparser');
var request = require('request');
var log = require('./log');

var options = require("../config").feed;

var dealError = function(error){
    console.log("$ error");
    console.log(error);
};

var dealMeta = function(meta){
    console.log("$ meta");
    console.log(meta);
};

var dealArticle = function(article){
    console.log("$ article");
    log(article);
};

var dealEnd = function(){
    console.log("$ end");
    //console.log(article);
};

var getRemote = function(url, callback){
    var dealEnd = function(){
        console.log("$ end");
        callback();
    };

    request(url)
        .pipe(new FeedParser(options))
        .on('error', dealError)
        .on('meta', dealMeta)
        .on('article', dealArticle)
        .on('end', dealEnd);
};

var getLocal = function(path, callback){
    var dealEnd = function(){
        console.log("$ end");
        callback();
    };

    fs.createReadStream(path)
        .pipe(new FeedParser(options))
        .on('error', dealError)
        .on('meta', dealMeta)
        .on('article', dealArticle)
        .on('end', dealEnd);
};

exports.getRemote = getRemote;
exports.getLocal = getLocal;

