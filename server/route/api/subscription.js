var Subscription = require('../../model/subscription');

exports.get = function(req, res){
    var opt = {}, sort;
    if(req.query.opt){
        for(var name in Subscription.struct){
            if(Subscription.struct.hasOwnProperty(name) && req.query.opt[name] !== null && req.query.opt[name] !== undefined){
                opt[name] = decodeURI(req.query.opt[name]);
            }
        }
    }
    opt.subscriber = req.session.uid;
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
            data: subscriptions[0]
        });
    }, sort);
};

exports.add = function(req, res){
    if(!req.body.subscribee){
        res.send(500, {err: 'missing params'});
        return;
    }

    var subscription = Subscription.create({
        subscriber: req.session.uid,
        subscribee: req.body.subscribee,
        description: req.body.description
    });

    Subscription.ifExist(subscription, function(err, exist){
        if(err || exist){
            res.json({
                err: err,
                data: exist
            });
            return;
        }
        subscription.save(function(err, subscription){
            res.json({
                err: err,
                data: subscription
            });
        });
    });
};

exports.read = function(req, res){
    if(!req.body.subscribee){
        res.send(500, {err: 'missing params'});
        return;
    }

    var time;
    try{
        time = req.body.time ? new Date(parseInt(req.body.time, 10)) : new Date();
    }catch(e){
        res.send(500, {err: 'wrong time!'});
        return;
    }

    var subscription = Subscription.create({
        subscriber: req.session.uid,
        subscribee: req.body.subscribee
    });

    Subscription.ifExist(subscription, function(err, subscription){
        if(err || !subscription){
            res.json({
                err: err
            });
            return;
        }

        subscription.lastReadDate = time;
        subscription.save(function(err){
            res.json({
                err: err
            });
        });
    });
};

exports.remove = function(req, res){
    if(!req.body.subscribee){
        res.send(500, {err: 'missing params'});
        return;
    }

    var subscription = Subscription.create({
        subscriber: req.session.uid,
        subscribee: req.body.subscribee,
        description: req.body.description
    });

    Subscription.ifExist(subscription, function(err, subscription){
        if(err || !subscription){
            res.json({
                err: err
            });
            return;
        }
        subscription.remove(function(err){
            res.json({
                err: err
            });
        });
    });
};