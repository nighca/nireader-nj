var User = require('../model/user');

exports.page = function(req, res){
    if(req.session.uid){
        res.send(req.session.uid);
        return;
    }
    res.render('signin', {title: 'signin'});
};

exports.check = function(req, res){
    if(!(req.body.username && req.body.password)){
        res.send(500);
        return;
    }

    var name = req.body.username, password = req.body.password;
    User.ifRight(name, password, function(err, user){
        if(err){
            res.send(err);
            return;
        }
        req.session.cookie.maxAge = 300000;
        req.session.uid = user.id;
        res.send(user);
    });
};