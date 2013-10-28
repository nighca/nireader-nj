define(function(require, exports, module){
    var local = require('./local').create('cache');
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

    var clear = function(){
        LOG('clear begin: ', storage);
        storage = {};
        hotList = [];
        local.clear();
        LOG('clear end: ', storage);
    };

    // persistence with localStorage
    var saveToLocal = function(){
        LOG('save to local begin: ', storage);
        local.clear();
        for(var name in storage){
            if(storage.hasOwnProperty(name)){
                local.set(name, JSON.stringify(storage[name]));
            }
        }
        LOG('save to local: ', storage);

        setTimeout(function(){
            LOG('local size: ', local.getSize());
        }, 100);
    };
    var loadFromLocal = function(){
        LOG('load from local begin: ', storage);
        var all = local.getAll();
        var item;
        var now = Date.now();
        for(var name in all){
            if(all.hasOwnProperty(name)){
                item = JSON.parse(all[name]);
                if(now < item.doom){
                    storage[name] = item;
                }
            }
        }
        LOG('load from local: ', storage);
    };
    window.storage = storage;
    window.local = local;

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

        saveToLocal();
    };

    var autoManage = function(){
        setInterval(manage, autoManageInterval);
    };

    loadFromLocal();
    autoManage();

    module.exports = {
        set: set,
        get: get,
        clear: clear
    };
});