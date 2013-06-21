var Channel = require('../model/channel');
var feed = require('../lib/feed');

var createWithSource = function (source, callback) {
    feed.getMetaRemote(source, function (err, meta) {
        if(err){
            callback(err);
        }

        var channel = Channel.createFromMeta(meta);

        callback(null, channel);
    });
};

exports.createWithSource = createWithSource;