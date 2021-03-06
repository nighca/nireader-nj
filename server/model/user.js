var db = require('../lib/data');
var Channel = require('./channel');
var Subscription = require('./subscription');

var tableName = 'user';
var struct = {
    name : 'string',
    mail : 'string',
    password : 'longstring',
    thirdParty : 'longstring',
    thirdPartyId : 'longstring',
    avatar : 'longlongstring',
    description : 'text'
};

db.initTable(tableName, struct, function(err, result){
    if(err){
        console.log('INIT TABLE ' + tableName, err);
    }
});

function User (options) {
    this.id = options.id || null;
    this.name = options.name || "anonymous";
    this.mail = options.mail || null;
    this.password = options.password || null;
    this.thirdParty = options.thirdParty || null;
    this.thirdPartyId = options.thirdPartyId || null;
    this.avatar = options.avatar || null;
    this.description = options.description || null;
}

var createUser = function(options){
    return new User(options);
};

var updateUser = function(user, callback){
    db.updateItem(tableName, user, callback);
};

var saveUser = function(user, callback){
    db.insertItem(tableName, user, function(err, result){
        if(!err){
            user.id = result.insertId;
        }
        callback && callback(err, user);
    });
};

var selectUser = function(options, callback, sort){
    db.selectItem(tableName, options, function(err, results){
        var users = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                users.push(createUser(results[i]));
            };
        }
        callback(err, users);
    }, sort);
};

var removeUser = function(options, callback){
    db.deleteItem(tableName, options, callback);
};

var ifExist = function(user, callback){
    var filter = user.thirdParty ?
        {
            thirdParty: user.thirdParty,
            thirdPartyId: user.thirdPartyId
        } :
        {
            name: user.name
        };
    selectUser(filter, function(err, users){
        if(err){
            callback && callback(err);
            return;
        }
        callback && callback(null, users.length > 0 ? users[0] : false);
    });
};

var ifRight = function(name, password, callback){
    selectUser({name: name}, function(err, users){
        if(err){
            callback && callback(err);
            return;
        }
        if(users.length===0){
            callback && callback('no such user');
            return;
        }
        var user = users[0];
        if(user.password !== password){
            callback && callback('password wrong');
            return;
        }
        callback(null, user);
    });
};


User.prototype.save = function(callback) {
    var user = this;
    if(user.id){
        updateUser(user, callback);
    }else{
        saveUser(user, callback);
    }
};

User.prototype.remove = function(callback) {
    var user = this;
    if(!user.id){
        callback && callback('ID not assigned.');
        return;
    }
    removeUser({id: user.id}, callback);
};

User.prototype.getSubscriptions = function(callback) {
    var user = this;
    if(!user.id){
        callback && callback('ID not assigned.');
        return;
    }
    Subscription.select({subscriber: user.id}, function(err, results){
        var subscriptions = [];
        if(!err){
            for (var i = 0, l = results.length; i < l; i++) {
                subscriptions.push(Subscription.create(results[i]));
            }
        }
        callback && callback(err, subscriptions);
    });
};

User.prototype.getChannels = function(callback) {
    this.getSubscriptions(function(err, subscriptions){
        if(err){
            callback(err, null);
            return;
        }
        var notFinished = 0;
        var subscription, channels = [];
        for (var i = 0, len = subscriptions.length; i < len; i++) {
            notFinished++;
            subscriptions[i].getChannel(function(err, channel){
                channels.push(channel);
                notFinished--;

                if(err){
                    callback(err);
                }
                if(!notFinished){
                    callback(null, channels);
                }
            });
        };
        if(!notFinished){
            callback(null, channels);
        }
    });
};

User.prototype.getItems = function(callback) {
    this.getSubscriptions(function(err, subscriptions){
        if(err){
            callback(err, null);
            return;
        }
        var notFinished = 0;
        var items = [];
        for (var i = 0, len = subscriptions.length; i < len; i++) {
            notFinished++;
            subscriptions[i].getItems(function(err, results){
                items.concat(results);
                notFinished--;

                if(err){
                    callback(err);
                }
                if(!notFinished){
                    callback(null, items);
                }
            });
        };
        if(!notFinished){
            callback(null, items);
        }
    });
};

User.prototype.cleanSubscriptions = function(callback) {
    var user = this;
    if(!user.id){
        callback && callback('ID not assigned.');
        return;
    }
    this.getSubscriptions(function(err, subscriptions){
        if(!err){
            for (var i = 0, len = subscriptions.length; i < len; i++) {
                subscriptions[i].cleanChannel();
            };
        }
    });
    Subscription.remove({subscriber: user.id}, callback);
};

exports.tableName = tableName;
exports.struct = struct;
exports.ifExist = ifExist;
exports.ifRight = ifRight;
exports.select = selectUser;
exports.create = createUser;
exports.update = updateUser;
exports.remove = removeUser;
exports.save = saveUser;
