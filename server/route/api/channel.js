var Channel = require('../../model/channel');
var feed = require('../../lib/feed');

var createChannelFromMeta = function(meta, xmlurl){
    return Channel.create({
        title : meta.title,
        link : meta.link,
        source: meta.xmlurl || meta.xmlUrl || xmlurl,
        description : meta.description,

        language : meta.language,
        copyright : meta.copyright,
        pubDate : meta.pubDate || meta.pubdate,
        category : meta.category,
        generator : meta.generator,
        webMaster : meta.webMaster
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

    //console.log(opt, sort);//-------------------------------

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

exports.create = function(req, res){
    if(!req.body.url){
        res.send(500, {err: 'missing params'});
        return;
    }
    
    feed.getMetaRemote(req.body.url, function (err, meta) {
        if(err){
            res.send(500, {err: err});
            return;
        }

        var channel = createChannelFromMeta(meta, req.body.url);
        res.json({
            err: err,
            data: channel
        });
    });
};

exports.save = function(req, res){
    if(!req.body.channel){
        res.send(500, {err: 'missing params'});
        return;
    }
    
    var channel = Channel.create(req.body.channel);
    channel.save(function(err, channel){
        channel.fetch();
        res.json({
            err: err,
            data: channel
        });
    });
};

exports.remove = function(req, res){
    res.send(404);
};