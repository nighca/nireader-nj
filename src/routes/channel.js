var User = require('../model/user');
var Channel = require('../model/channel');
var Item = require('../model/item');
var Subscription = require('../model/subscription');
var feed = require('../lib/feed');
var getDay = require('../lib/date').getDay;

var createWithUrl = function (source, callback) {
    feed.getMetaRemote(source, function (err, meta) {
        if(err){
            callback(err);
            return;
        }

        var channel = Channel.createFromMeta(meta);
        channel.save(function(){
            channel.fetch();
        });

        callback(null, channel);
    });
};

//get
exports.get = function(req, res){
    var dealChannels = function (err, channels) {
        if(err){
            res.send(500, {error: err});
            return;
        }

        var cid = parseInt(req.params.cid, 10);
        var prev, channel, next;

        for (var i = 0; i < channels.length; i++) {
            if(channels[i].id === cid){
                channel = channels[i];
                prev = channels[i - 1];
                next = channels[i + 1];
                break;
            }
        };

        if(!channel){
            res.send(404);
            return;
        }

        channel.getItems(function(err, items){
            if(err){
                res.send(err);
                return;
            }

            for (var i = 0, l = items.length; i < l; i++) {
                items[i].pubDate = getDay(items[i].pubDate, "-");
            };

            channel.items = items;
            res.render('channel', { title: 'channel', channel: channel, prev: prev, next: next });
        });
    };
    Channel.getAll(dealChannels);
};

exports.userGet = function(req, res){
    var dealChannels = function (err, channels) {
        if(err){
            res.send(500, {error: err});
            return;
        }

        var cid = parseInt(req.params.cid, 10);
        var prev, channel, next;

        for (var i = 0; i < channels.length; i++) {
            if(channels[i].id === cid){
                channel = channels[i];
                prev = channels[i - 1];
                next = channels[i + 1];
                break;
            }
        };

        if(!channel){
            res.send(404);
            return;
        }

        channel.getItems(function(err, items){
            if(err){
                res.send(err);
                return;
            }

            for (var i = 0, l = items.length; i < l; i++) {
                items[i].pubDate = getDay(items[i].pubDate, "-");
            };

            channel.items = items;
            res.render('channel', { title: 'channel', channel: channel, prev: prev, next: next });
        });
    };

    var getChannelsByUid = function(uid, callback){
        User.select({id: uid}, function(err, users){
            if(err){
                callback && callback(err);
                return;
            }
            var user = users[0];
            user.getChannels(callback);
        });
    };

    if(req.session.uid){
        getChannelsByUid(req.session.uid, dealChannels);
    }else{
        Channel.getAll(dealChannels);
    }
};


//post
exports.add = function(req, res){
    if(!req.body.url){
        res.send(500, {error: 'no url'});
        return;
    }
    
    createWithUrl(req.body.url, function(err, channel){
        if(!err){
            res.send("ok");
        }else{
            res.send(err);
        }
    });
};