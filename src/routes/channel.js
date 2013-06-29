var Channel = require('../model/channel');
var Item = require('../model/item');
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
    if(req.session.uid){

    }else{}
    var cid = parseInt(req.params.cid, 10);
    var query = 'id>=' + (cid-1) + ' AND ' + 'id<=' + (cid+1);
    Channel.select({id: cid}, function (err, channels) {
        if(err){
            res.send(500, {error: err});
            return;
        }else if(channels.length === 0){
            res.send(404);
            return;
        }

        var channel = channels[0];
        Item.select({source:channel.id}, function(err, items){
            if(err){
                res.send(err);
                return;
            }

            for (var i = 0, l = items.length; i < l; i++) {
                items[i].pubDate = getDay(items[i].pubDate, "-");
            };

            channel.items = items;
            res.render('channel', { title: 'channel', channel: channel });
        });
    });
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