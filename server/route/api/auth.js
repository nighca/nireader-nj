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
        //req.session.cookie.maxAge = 300000;
        req.session.uid = user.id;
        res.json({
            err: null,
            data: {
                success: true
            }
        });
    });
};

exports.out = function(req, res){
    req.session = null;
    res.clearCookie('connect.sid');

    res.json({
        err: null,
        data: {
            success: true
        }
    });
};