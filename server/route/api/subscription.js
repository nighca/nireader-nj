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
    };
    for(var name in Subscription.struct){
        if(Subscription.struct.hasOwnProperty(name) && req.query[name] !== null && req.query[name] !== undefined){
            opt[name] = decodeURI(req.query[name]);
        }
    }
    var sort = req.query.ORDER ? {
        order: decodeURI(req.query.ORDER),
        descrease: req.query.DESCREASE
    } : null;

    console.log(opt, sort);//-------------------------------

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