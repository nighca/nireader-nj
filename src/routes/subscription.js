var Subscription = require('../model/subscription');

//get
exports.get = function(req, res){
    Subscription.select({id: req.params.sid}, function (err, subscriptions) {
        if(err){
            res.send(500, {error: err});
            return;
        }else if(subscriptions.length === 0){
            res.send(404);
            return;
        }

        res.send(subscriptions);
    });
};


//post
exports.add = function(req, res){
    var subscriber = req.body.subscriber,
        subscribee = req.body.subscribee,
        description = req.body.description;

    if(!(subscriber && subscribee)){
        res.send(500, {error: 'no subscriber or subscribee'});
        return;
    }
    
    var subscription = Subscription.create({
        subscriber: subscriber,
        subscribee: subscribee,
        description: description
    });
    subscription.save(function(err, subscription){
        res.json({
            err: err,
            result: subscription
        });
    });
};

exports.remove = function(req, res){
    var subscriber = req.body.subscriber,
        subscribee = req.body.subscribee;

    if(!(subscriber && subscribee)){
        res.send(500, {error: 'no subscriber or subscribee'});
        return;
    }
    
    Subscription.remove({
        subscriber: subscriber,
        subscribee: subscribee
    }, function(err, result){
        res.json({
            err: err,
            result: result
        });
    });
};