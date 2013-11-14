var Item = require('../model/item');
var Channel = require('../model/channel');
var doQuery = require('../lib/data').doQuery;

var config = require('../config/task.json').cleanItem;

var cleanChannel = function(channel, callback){
    var sql =
        'SELECT id FROM ' + Item.tableName +
        ' WHERE source = ' + channel.id +
        ' ORDER BY pubDate DESC LIMIT 0, ' + config.reserveNum;
    doQuery(sql, function(err, result){
        if(err){
            callback && callback("Get item num fail: ", err);
            return;
        }

        if(result.length >= config.reserveNum){
            sql =
                'DELETE FROM ' + Item.tableName +
                ' WHERE source = ' + channel.id + ' AND id NOT IN (';
            var ids = '';
            for(var i = 0, l = result.length; i < l; i++){
                ids += result[i].id;
                if(i < l-1){
                    ids += ',';
                }
            }
            sql += ids + ')';
            
            doQuery(sql, callback);
        }
    });
};

var cleanChannels = function(callback){
    Channel.select({}, function (err, channels) {
        if(err){
            callback && callback("Select channels fail: ", err);
            return;
        }

        var i = 0, l = channels.length;
        var timer = setInterval(function(){
            if(i < l){
                if(channels[i]){
                    cleanChannel(channels[i]);
                }
                i++;
            }else{
                clearInterval(timer);
            }
        }, 1000);
    });
};

exports.run = function(){
    setTimeout(function(){
        cleanChannels();
        setInterval(function(){
            cleanChannels();
        }, config.cleanInterval);
    }, 1000 * 60 * 1);
};
