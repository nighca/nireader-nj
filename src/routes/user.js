var User = require('../model/user');
var Subscription = require('../model/subscription');

//get
exports.get = function(req, res){
    User.select({id: req.params.uid}, function (err, users) {
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
            res.render('user', { title: 'user', user: user });
        });
    });
};


//post
exports.add = function(req, res){
    var name = req.body.name,
        password = req.body.password,
        description = req.body.description,
        mail = req.body.mail;

    if(!(name && password)){
        res.send(500);
        return;
    }
    
    var user = User.create({
        name: name,
        password: password,
        description: description,
        mail: mail,
    });
    user.save(function(err, user){
        res.json({
            error: err,
            result: user
        });
    });
};