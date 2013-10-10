define(function(require, exports, module){
    var autoManageInterval = 1000 * 60 * 1; // 5min
    var expireTime = 1000 * 60 * 1; // 1min
    var maxCacheNum = 50;
    // temporarily use array to record hot list
    // todo: use sth more effective instead, such as heap

    var storage = {};
    var hotList = [];

    var touch = function(name, remove){
        var pos = hotList.indexOf(name),
            lastPos = hotList.length - 1;

        if(pos >= 0 && pos != lastPos){
            hotList.splice(pos, 1);
        }
        if(!remove){
            hotList.push(name);
        }
    };

    var set = function(name, obj){
        name = JSON.stringify(name);
        obj = JSON.stringify(obj);

        touch(name);

        storage[name] = {
            cnt: obj,
            birth: Date.now()
        };
    };

    var get = function(name){
        name = JSON.stringify(name);

        touch(name);

        var obj = storage[name];

        if(obj){
            return JSON.parse(obj.cnt);
        }
    };

    var remove = function(name){
        name = JSON.stringify(name);

        touch(name, true);
        return (delete storage[name]);
    };

    var manage = function(){
        var now = Date.now();
        for(var name in storage){
            if(storage.hasOwnProperty(name)){
                if(now - storage[name].birth > expireTime){
                    touch(name, true);
                    delete storage[name];
                }
            }
        }

        var overNum = hotList.length - maxCacheNum;
        for (var i = 0, name; i < overNum; i++) {
            name = hotList[i];
            delete storage[name];
        }

        hotList = hotList.slice(overNum, hotList.length);
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