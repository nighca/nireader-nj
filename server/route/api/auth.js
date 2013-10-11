var User = require('../../model/user');

exports.in = function(req, res){
    if(!(req.body.username && req.body.password)){
        res.send(500, {error: 'missing param.'});
        return;
    }

    var name = req.body.username,
        password = req.body.password;

    User.ifRight(name, password, function(err, user){
        if(err){
            res.send(404, err);
            return;
        }
        req.session.uid = user.id;

        if(!req.get('isAjax')){
            res.redirect(req.body.target || '/');
            return;
        }

        user.password = null;
        res.json({
            err: null,
            data: user
        });
    });
};

exports.out = function(req, res){
    req.session = null;

    res.json({
        err: null,
        data: {
            success: true
        }
    });
};