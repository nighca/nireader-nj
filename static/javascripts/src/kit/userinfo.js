define(function(require, exports, module){
    var cookie = require('./cookie');
    var request = require('./request');
    var cache = require('./cache');
    var interfaces = require('../interface/index');
    var apis = interfaces.api;
    var pages = interfaces.page;

    var identityKey = 'WhoAmI';

    var isLogin = function(callback){
        callback && callback(!!cookie.get(identityKey));
    };

    var getUserinfo = function(callback){
    };

    var logout = function(callback){
        request.get(apis.auth.out, function(err){
            cache.clear();
            callback && callback(err);
        });
    };

    module.exports = {
        isLogin: isLogin,
        logout: logout
    };
});