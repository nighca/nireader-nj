var User = require('../../model/user');

exports.get = function(req, res){
    var opt = {};
    if(req.query.id){
        opt.id = req.query.id;
    }
    for(var name in User.struct){
        if(User.struct.hasOwnProperty(name) && req.query[name] !== null && req.query[name] !== undefined){
            opt[name] = decodeURI(req.query[name]);
        }
    }
    var sort = req.query.ORDER ? {
        order: decodeURI(req.query.ORDER),
        descrease: req.query.DESCREASE
    } : null;

    console.log(opt, sort);//-------------------------------

    User.select(opt, function(err, users){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(users.length === 0 || !users[0]){
            res.send(404);
            return;
        }

        res.json({
            err: err,
            data: users
        });
    }, sort);
};