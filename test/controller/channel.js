var ctl = require('../../src/controller/channel');

ctl.createWithSource('http://nighca.me/feed/', function (err, channel) {
	if(err){
		console.error(err);
		return;
	}

	channel.save(function(){
		console.log(channel);
		channel.remove();
	});
});