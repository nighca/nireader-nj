var Subscription = require('../../model/subscription');

exports.get = function(req, res){
    if(!req.session.uid){
        res.json({
            err: 'need auth'
        });
        return;
    }

    var opt = {
        id: req.session.uid
    }, sort;
    if(req.query.opt){
        for(var name in Subscription.struct){
            if(Subscription.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
    }
    if(req.query.sort){
        sort = {
            order: req.query.sort.order ? decodeURI(req.query.sort.order) : null,
            descrease: req.query.sort.descrease
        };
    }

    //console.log(opt, sort);//-------------------------------

    Subscription.select(opt, function(err, subscriptions){
        if(err){
            res.send(500, {err: err});
            return;
        }else if(subscriptions.length === 0 || !subscriptions[0]){
            res.send(404);
            return;
        }

        res.json({
            err: err,
            data: subscriptions
        });
    }, sort);
};