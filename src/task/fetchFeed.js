var feed = require('../lib/feed');
var Channel = require('../src/model/channel');

var forEach = function(arr, func){
	if(!arr.length) return;
	for(var i = 0, l = arr.length; i < l; i++){
		func(arr[i], i);
	}
};

var fetchAll = function(callback){
	Channel.select({}, function (err, channels) {
		if(err || channels.length === 0){
			callback && callback(err);
			return;
		}
		var notFinished = 0;
		forEach(channels, function(channel){
			notFinished++;
			channel.fetch(function(err){
				notFinished--;
				if(!notFinished){
					callback && callback(err);
				}
			});
		});
	});
};

