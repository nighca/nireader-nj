var db = require('../lib/db');

var Channel = require('../model/channel');
var Subscription = require('../model/subscription');
var Item = require('../model/item');

exports.index = function(req, res){
    Channel.select({}, function(err, channels){
        if(err){
            res.send(err);
            return;
        }

        Item.select({}, function(err, items){
            if(err){
                res.send(err);
                return;
            }

            for (var i = 0, il = items.length; i < il; i++) {
                for (var j = 0, cl = channels.length; j < cl; j++) {
                    if(channels[j].id === items[i].source){
                        channels[j].items = channels[j].items || [];
                        channels[j].items.push(items[i]);
                    }
                };
            };

            res.render('listSrc', { title: 'listSrc', channels: channels });
        });
    });
};

exports.item = function(req, res){
    var query;
    var callback = function (err, results) {
        res.json({
            //query: query,
            error: err,
            result: results
        });
    };

    var paramPattern = /^[\d\w]+$/;
    if((req.query.cid && !paramPattern.test(req.query.cid)) || 
        (req.query.order && !paramPattern.test(req.query.order))){
        res.json({
            error: 'wrong param'
        });
        return;
    }

    var order = req.query.order || 'pubDate DESC';
    if(req.query.cid){
        query = 'SELECT id, title, pubDate, source FROM ' + 
            Item.tableName + 
            ' WHERE source = ' + 
            req.query.cid + 
            ' ORDER BY ' + 
            order;
    }else{
        query = 'SELECT id, title, pubDate, source FROM ' + 
            Item.tableName + 
            ' ORDER BY ' + 
            order;
    }
    db.doQuery(query, callback);
};

exports.channel = function(req, res){
    var query;
    var callback = function (err, results) {
        res.json({
            //query: query,
            error: err,
            result: results
        });
    };

    var paramPattern = /^[\d\w]+$/;
    if((req.query.uid && !paramPattern.test(req.query.uid)) || 
        (req.query.order && !paramPattern.test(req.query.order))){
        res.json({
            error: 'wrong param'
        });
        return;
    }

    var order = req.query.order || 'title';
    if(req.query.uid){
        query = 'SELECT channel.id, channel.title, channel.pubDate FROM ' + 
            Channel.tableName + ', ' + 
            Subscription.tableName + 
            ' WHERE channel.id = subscription.subscribee AND subscription.subscriber = ' + 
            req.query.uid + 
            ' ORDER BY ' + 
            order;
    }else{
        query = 'SELECT id, title, pubDate FROM ' + 
            Channel.tableName + 
            ' ORDER BY ' + 
            order;
    }
    db.doQuery(query, callback);
};