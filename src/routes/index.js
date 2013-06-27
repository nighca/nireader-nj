var Channel = require('../model/channel');
var User = require('../model/user');

exports.index = function(req, res){
	User.select({id:1}, function(err, users){
		var status = 200;
        if(err){
            status = 500;
        }else if(users.length === 0){
            status = 404;
        }

        var user = users[0];
        user.getChannels(function(err, channels){
            if(err){
                res.send(err);
                return;
            }
            user.channels = channels;
            res.render('user', { title: 'user', user: user });
        });
	});
};