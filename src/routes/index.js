var Channel = require('../model/channel');
var User = require('../model/user');

exports.index = function(req, res){
    if(req.session.uid){
        User.select({id:req.session.uid}, function(err, users){
            if(err){
                res.send(500, {error: err});
                return;
            }else if(users.length === 0){
                res.send(404);
                return;
            }

            var user = users[0];
            user.getChannels(function(err, channels){
                if(err){
                    res.send(err);
                    return;
                }
                user.channels = channels;

                Channel.getAll(function(err, all){
                    res.render('home', { title: 'home', user: user, channels: all });
                });
            });
        });
    }else{
        res.render('entrance', {title: 'home'});
    }
    
    
};