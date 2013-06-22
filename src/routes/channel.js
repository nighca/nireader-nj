var Channel = require('../model/channel');
var feed = require('../lib/feed');

var createWithUrl = function (source, callback) {
    feed.getMetaRemote(source, function (err, meta) {
        if(err){
            callback(err);
        }

        var channel = Channel.createFromMeta(meta);
        channel.save(function(){
            channel.fetch();
        });

        callback(null, channel);
    });
};

exports.get = function(req, res){
    //res.send('get!');
    Channel.select({}, function (err, results) {
        console.log(err, results);
        res.json({
            err: err,
            data: results
        });
    });
};

exports.add = function(req, res){
    if(!req.body.url){
        res.send("no url!");
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