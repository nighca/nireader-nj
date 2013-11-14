var Channel = require('../model/channel');

var config = require('../config/task.json').fetchFeed;

var forEach = function(arr, func){
    if(!arr.length) return;
    for(var i = 0, l = arr.length; i < l; i++){
        func(arr[i], i);
    }
};

var fetchFeedOnce = function(callback){
    Channel.select({}, function (err, channels) {
        if(err){
            callback && callback("Select channels fail: ", err);
            return;
        }
        if(channels.length === 0){
            callback && callback(null);
            return;
        }

        var notFinished = 0, error;
        forEach(channels, function(channel, i){
            notFinished++;
            setTimeout(function(){
                channel.fetch(function(err){
                    notFinished--;
                    if(err){
                        console.error("Fetch fail:channel " + channel.title, err);
                        error = err;
                    }
                    if(!notFinished){
                        callback && callback(error);
                    }
                });
            }, 1000 * 2 * i);
        });
    });
};

var fetchFeed = function(times){
    if(times > 0){
        times--;
        fetchFeedOnce(function(err){
            if(err){
                setTimeout(function(){
                    fetchFeed(times);
                }, 1000);
            }
        });
    }
};

exports.run = function(){
    fetchFeed(config.tryFetchTimes);
    setInterval(function(){
        fetchFeed(config.tryFetchTimes);
    }, config.fetchInterval);
};
