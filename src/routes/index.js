var Channel = require('../model/channel');
var User = require('../model/user');

exports.index = function(req, res){
    if(req.session.uid){
        User.select({id:req.session.uid}, function(err, users){
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

                Channel.getAll(function(err, all){
                    res.render('user', { title: 'home', user: user, channels: all });
                });
            });
        });
    }else{
        res.render('home', {title: 'home'});
    }
    
    
};