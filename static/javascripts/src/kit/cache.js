define(function(require, exports, module){
    var config = require('../config').cache;
    var autoManageInterval = config.manageInterval;
    var defaultLifetime = config.lifetime;
    var maxCacheNum = config.maxNum;

    // temporarily use array to record hot list
    // todo: use sth more effective instead, such as heap

    var storage = {};
    var hotList = [];

    var timer;
    var cacheStatus = function(){
        window.LOG.apply(window, arguments);

        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            window.LOG('storage: ', storage, 'hotList: ', hotList);
            timer = null;
        }, 10);
    };

    var touch = function(name, remove){
        var pos = hotList.indexOf(name);

        if(pos >= 0){
            hotList.splice(pos, 1);
        }
        if(!remove){
            hotList.push(name);
        }
    };

    var set = function(name, obj, lifetime){
        name = JSON.stringify(name);
        obj = JSON.stringify(obj);

        touch(name);

        cacheStatus('cache: ', name);

        storage[name] = {
            cnt: obj,
            doom: Date.now() + (lifetime || defaultLifetime)
        };
    };

    var get = function(name){
        name = JSON.stringify(name);

        var obj = storage[name];

        cacheStatus((obj ? 'catch': 'miss') + ' in cache: ', name);

        if(obj){
            touch(name);
            return JSON.parse(obj.cnt);
        }
    };

    var remove = function(name){
        name = JSON.stringify(name);

        touch(name, true);

        cacheStatus('remove cache: ', name);

        return (delete storage[name]);
    };

    var manage = function(){

        cacheStatus('manage cache...');

        var now = Date.now();
        for(var name in storage){
            if(storage.hasOwnProperty(name)){
                if(now > storage[name].doom){
                    touch(name, true);

                    cacheStatus('cache expired: ', name);

                    delete storage[name];
                }
            }
        }

        var overNum = hotList.length - maxCacheNum;
        for (var i = 0, name; i < overNum; i++) {
            name = hotList[i];

            cacheStatus('cache over num: ', name); 

            delete storage[name];
        }

        hotList = hotList.slice(overNum, hotList.length);

        cacheStatus('manage cache end.');
    };

    var autoManage = function(){
        setInterval(manage, autoManageInterval);
    };

    autoManage();

    module.exports = {
        set: set,
        get: get
    };
});