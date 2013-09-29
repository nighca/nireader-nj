define(function(require, exports, module){
    var autoManageInterval = 1000 * 60 * 5; // 5min
    var maxCacheNum = 50;
    // temporarily use array to record hot list
    // todo: use sth more effective instead, such as heap

    var storage = [];
    var hotList = [];

    var touch = function(name){
        var pos = hotList.indexOf(name),
            lastPos = hotList.length - 1;

        if(pos >= 0 && pos != lastPos){
            hotList.splice(pos, 1);
        }
        hotList.push(name);
    };

    var set = function(name, obj){
        name = JSON.stringify(name);
        obj = JSON.stringify(obj);

        touch(name);

        storage[name] = obj;
    };

    var get = function(name){
        name = JSON.stringify(name);

        touch(name);

        var obj = storage[name];

        if(obj){
            return JSON.parse(obj);
        }
    };

    var remove = function(name){
        name = JSON.stringify(name);

        return (delete storage[name]);
    };

    var manage = function(){
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