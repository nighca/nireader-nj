var db = require('../lib/db');
var Channel = require('./channel');

var tableName = 'subscription';

db.initTable(tableName, {
    description : 'text',
    subscriber : 'number',
    subscribee : 'number'
}, function(err, result){
    if(err){
        console.log('INIT TABLE ' + tableName, err);
    }
});

function Subscription (options) {
    this.id = options.id || null; 
    this.subscriber = options.subscriber || null; 
    this.subscribee = options.subscribee || null; 
    this.description = options.description || null; 
}

var createSubscription = function(options){
    return new Subscription(options);
};

var updateSubscription = function(subscription, callback){
    db.updateItem(tableName, subscription, callback);
};

var saveSubscription = function(subscription, callback){
    db.insertItem(tableName, subscription, function(err, result){
        if(!err){
            subscription.id = result.insertId;
        }
        callback && callback(err, subscription);
    });
};

var selectSubscription = function(options, callback){
    db.selectItem(tableName, options, function(err, results){
        var subscriptions = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                subscriptions.push(createSubscription(results[i]));
            };
        }
        callback(err, subscriptions);
    });
};

var removeSubscription = function(options, callback){
    db.deleteItem(tableName, options, callback);
};

var ifExist = function(subscription, callback){
    selectSubscription({
        subscriber: subscription.subscriber,
        subscribee: subscription.subscribee
    }, function(err, subscriptions){
        if(err){
            callback && callback(err);
            return;
        }
        if(subscriptions.length>0){
            callback && callback('already exist');
            return;
        }
        callback && callback(null);
    });
};

Subscription.prototype.save = function(callback) {
    var subscription = this;
    if(subscription.id){
        updateSubscription(subscription, callback);
    }else{
        selectSubscription({
            subscriber : subscription.subscriber,
            subscribee : subscription.subscribee
        }, function(err, sameSubscriptions){
            if(!err && sameSubscriptions.length > 0){
                callback && callback(null);
                return;
            }
            saveSubscription(subscription, callback);
        });
    }
};

Subscription.prototype.remove = function(callback) {
    var subscription = this;
    if(!subscription.id){
        callback && callback('ID not assigned.');
        return;
    }
    removeSubscription({id: subscription.id}, callback);
};

Subscription.prototype.getChannel = function(callback) {
    var subscription = this;
    if(!subscription.subscribee){
        callback && callback('subscribee not assigned.');
        return;
    }
    db.selectItem('channel', {id: subscription.subscribee}, function(err, results){
        var channel;
        if(!err){
            channel = Channel.create(results[0]);
        }
        callback && callback(err, channel);
    });
};

Subscription.prototype.cleanChannel = function(callback) {
    var subscription = this;
    if(!subscription.subscribee){
        callback && callback('subscribee not assigned.');
        return;
    }
    //db.deleteItem('channel', {id: subscription.subscribee}, callback);
};

exports.ifExist = ifExist;
exports.select = selectSubscription;
exports.create = createSubscription;
exports.update = updateSubscription;
exports.remove = removeSubscription;
exports.save = saveSubscription;
