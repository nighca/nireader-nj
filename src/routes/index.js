var Channel = require('../model/channel');

exports.index = function(req, res){
	var user;
	Channel.select({}, function(err, channels){
        if(err){
            res.send(err);
            return;
        }
	    res.render('home', { title: 'Home', user: user});
    });
};