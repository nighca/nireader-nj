define(function(require, exports, module){
    var request = require('./request');
    var formatUrl = require('./url').format;

    var resources = {};

    var getResource = function(url, callback, refresh){
        if(!url){
            return;
        }
        url = formatUrl(url);
        if(!refresh && resources[url]){
            callback && callback(null, resources[url]);
            return;
        }
        request.get(url, function(err, resource){
            if (!err) {
                resources[url] = resource;
            }
            callback && callback(err, resource);
        });
    };

    exports.get = getResource;
});