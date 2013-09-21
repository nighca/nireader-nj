define(function(require, exports, module){
    var removeBeforeSlash = function(url){
        var p = url.indexOf("://");
        if(p<0){
            return url;
        }
        url = url.slice(p+3);
        p = url.indexOf("/");
        if(p<0){
            return "/";
        }
        return url.slice(p);
    };

    var addPath = function(url){
        if(!url.indexOf('/')){
            return url;
        }
        return location.pathname.replace(/([\w\d\_]*)$/, url);
    };

    var formatUrl = function(url){
        if(!url){
            return null;
        }
        
        url = removeBeforeSlash(url);
        url = addPath(url);
        return url;
    };

    var getType = function(url){
        var pattern = /([^\/]+)\/[^\/]*$/;
        return pattern.test(url) ? pattern.exec(url)[1] : null;
    };

    exports.format = formatUrl;
    exports.getType = getType;
});