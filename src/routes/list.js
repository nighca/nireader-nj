var db = require('../lib/db');

var Channel = require('../model/channel');
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

    if(req.query.cid){
        var order = req.query.order || 'pubDate DESC';
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