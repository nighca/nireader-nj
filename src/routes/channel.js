var Channel = require('../model/channel');
var feed = require('../lib/feed');

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
    Channel.select({id: req.params.cid}, function (err, channels) {
        var status = 200;
        if(err){
            status = 500;
        }else if(channels.length === 0){
            status = 404;
        }
        res.json(status, channels);
    });
};


//post
exports.add = function(req, res){
    if(!req.body.url){
        res.send(500);
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