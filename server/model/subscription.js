var db = require('../lib/data');
var Channel = require('./channel');
var Item = require('./item');

var tableName = 'subscription';
var struct = {
    description: 'text',
    subscribeDate: 'time',
    subscriber: 'number',
    subscribee: 'number',
    lastReadDate: 'time'
};

db.initTable(tableName, struct, function(err, result){
    if(err){
        console.log('INIT TABLE ' + tableName, err);
    }
});

function Subscription (options) {
    this.id = options.id || null; 
    this.subscribeDate = new Date();
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

var selectSubscription = function(options, callback, sort){
    db.selectItem(tableName, options, function(err, results){
        var subscriptions = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                subscriptions.push(createSubscription(results[i]));
            };
        }
        callback(err, subscriptions);
    }, sort);
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
        callback && callback(null, subscriptions.length > 0 ? subscriptions[0] : false);
    });
};

Subscription.prototype.save = function(callback) {
    var subscription = this;
    if(subscription.id){
        updateSubscription(subscription, callback);
    }else{
        saveSubscription(subscription, callback);
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
    Channel.select({id: subscription.subscribee}, function(err, channels){
        if(err){
            callback && callback(err);
            return;
        }else if(channels.length === 0){
            callback && callback('no such channel');
            return;
        }
        callback && callback(null, channels[0]);
    });
};

Subscription.prototype.getItems = function(callback) {
    var subscription = this;
    Item.select({source: subscription.subscribee}, function(err, items){
        if(err){
            callback && callback(err);
            return;
        }
        callback && callback(err, items);
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

exports.tableName = tableName;
exports.struct = struct;
exports.ifExist = ifExist;
exports.select = selectSubscription;
exports.create = createSubscription;
exports.update = updateSubscription;
exports.remove = removeSubscription;
exports.save = saveSubscription;
