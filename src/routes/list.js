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