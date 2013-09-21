var Channel = require('../model/channel');
var feed = require('../lib/feed');

var createWithUrl = function (source, callback) {
    feed.getMetaRemote(source, function (err, meta) {
        if(err){
            callback(err);
            return;
        }

        var channel = Channel.createFromMeta(meta, source);
        channel.save(function(){
            channel.fetch();
            callback(null, channel);
        });
    });
};

//get
exports.get = function(req, res){
    Channel.select({id: req.params.cid}, function(err, channels){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(channels.length === 0 || !channels[0]){
            res.send(404);
            return;
        }

        if(req.get('isAjax')){
            res.json({
                err: err,
                data: channels
            });
        }else{
            res.render('reader', {title: 'channel'});
        }
    });
};

//post
exports.add = function(req, res){
    if(!req.body.url){
        res.send(500, {err: 'missing params'});
        return;
    }
    
    createWithUrl(req.body.url, function(err, channel){
        res.json({
            err: err
        });
    });
};