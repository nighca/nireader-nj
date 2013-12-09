define(function(require, exports, module){
    var encodeKey = function(key, domain){
        return domain + '$' + key;
    };

    var decodeKey = function(key, domain){
        return key.slice(domain.length + 1);
    };

    var isInDomain = function(key, domain){
        return !domain || key.indexOf(domain + '$') === 0;
    };

    var set = function(domain, key, val){
        key = encodeKey(key, domain);
        try{
            return localStorage[key] = val;
        }catch(e){
            LOG('set localStorage error: ', e);
            return null;
        }
    };

    var get = function(domain, key){
        key = encodeKey(key, domain);
        return localStorage[key];
    };

    var remove = function(domain, key){
        key = encodeKey(key, domain);
        localStorage.removeItem(key);
    };

    var getAll = function(domain){
        var all = {};
        for(var i = 0, l = localStorage.length, key, val; i < l; i++){
            key = localStorage.key(i);

            if(key && isInDomain(key, domain)){
                val = localStorage[key];
                all[decodeKey(key, domain)] = val;
            }
        }
        return all;
    };

    var clear = function(domain){
        for(var i = localStorage.length - 1, key, val; i >= 0; i--){
            key = localStorage.key(i);

            if(key && isInDomain(key, domain)){
                localStorage.removeItem(key);
            }
        }
    };

    var getSize = function(domain){
        var num = 0, size = 0;
        for(var i = 0, l = localStorage.length, key, val; i < l; i++){
            key = localStorage.key(i);

            if(key && isInDomain(key, domain)){
                num++;
                val = localStorage[key];
                size += key.length + val.length;
            }
        }
        var B = size * 2;
        var KB = B / 1024;
        var MB = KB / 1024;

        return {
            num: num,
            length: size,
            B: B,
            KB: KB.toFixed(2),
            MB: MB.toFixed(2)
        };
    };

    var create = function(domain){
        return {
            get: function(key){
                return get(domain, key);
            },
            remove: function(key){
                return remove(domain, key);
            },
            set: function(key, val){
                return set(domain, key, val);
            },
            getAll: function(){
                return getAll(domain);
            },
            clear: function(){
                return clear(domain);
            },
            getSize: function(){
                return getSize(domain);
            }
        };
    };

    module.exports = {
        create: create
    };
});