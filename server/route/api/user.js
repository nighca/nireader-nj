var User = require('../../model/user');

exports.get = function(req, res){
    var opt = {}, sort;
    if(req.query.opt){
        for(var name in User.struct){
            if(User.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
    }
    opt.id = req.session.uid;

    if(req.query.sort){
        sort = {
            order: req.query.sort.order ? decodeURI(req.query.sort.order) : null,
            descrease: req.query.sort.descrease
        };
    }

    //console.log(opt, sort);//-------------------------------

    User.select(opt, function(err, users){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(users.length === 0 || !users[0]){
            res.send(404);
            return;
        }

        if(users[0]){
            users[0].password = 'iAmNotThePassword';
        }

        res.json({
            err: err,
            data: users[0]
        });
    }, sort);
};