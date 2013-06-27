var Subscription = require('../model/subscription');

//get
exports.get = function(req, res){
    Subscription.select({id: req.params.sid}, function (err, subscriptions) {
        var status = 200;
        if(err){
            status = 500;
        }else if(subscriptions.length === 0){
            status = 404;
        }

        res.send(status, subscriptions);
    });
};


//post
exports.add = function(req, res){
    var subscriber = req.body.subscriber,
        subscribee = req.body.subscribee,
        description = req.body.description;

    if(!(subscriber && subscribee)){
        res.send(500);
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