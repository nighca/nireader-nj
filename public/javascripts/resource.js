var resourceManager = (function(){
    var resources = {};
    return {
        get: function(url, callback, refresh){
            if(!url){
                return;
            }
            url = formatUrl(url);
            if(!refresh && resources[url]){
                callback && callback(null, resources[url]);
                return;
            }
            getData(url, function(err, resource){
                if (!err) {
                    resources[url] = resource;
                }
                callback && callback(err, resource);
            });
        }
    };
})();

var getResource = resourceManager.get;

var getItem = function(url, callback, refresh){
    getResource(url, callback, refresh);
};

var getChannel = function(url, callback, refresh){
    if(refresh !== false){
        refresh = true;
    }
    getResource(url, callback, refresh);
};