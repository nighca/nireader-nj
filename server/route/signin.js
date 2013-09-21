var User = require('../model/user');

exports.get = function(req, res){
    if(req.session.uid){
        res.redirect('/');
        return;
    }
    res.render('signin', {title: 'signin', target:req.query.target});
};

exports.post = function(req, res){
    if(!(req.body.username && req.body.password)){
        res.send(500, {error: 'missing param.'});
        return;
    }

    var name = req.body.username,
        password = req.body.password,
        target = req.body.target || '/';

    User.ifRight(name, password, function(err, user){
        if(err){
            res.send(404, err);
            return;
        }
        //req.session.cookie.maxAge = 300000;
        req.session.uid = user.id;
        res.redirect(target);
    });
};