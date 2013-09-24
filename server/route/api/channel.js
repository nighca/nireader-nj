var Channel = require('../../model/channel');
var feed = require('../../lib/feed');

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

exports.get = function(req, res){
    var opt = {}, sort;
    if(req.query.opt){
        if(req.query.opt.id){
            opt.id = req.query.opt.id;
        }
        for(var name in Channel.struct){
            if(Channel.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
    }
    if(req.query.sort){
        sort = {
            order: req.query.sort.order ? decodeURI(req.query.sort.order) : null,
            descrease: req.query.sort.descrease
        };
    }

    console.log(opt, sort);//-------------------------------

    Channel.select(opt, function(err, channels){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(channels.length === 0 || !channels[0]){
            res.send(404);
            return;
        }

        res.json({
            err: err,
            data: channels
        });
    }, sort);
};

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

exports.remove = function(req, res){
    res.send(404);
};