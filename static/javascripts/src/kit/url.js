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

    var concatWithCurrentPath = function(url){
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
        url = concatWithCurrentPath(url);
        return url;
    };

    /*var getType = function(url){
        var pattern = /([^\/]+)\/[^\/]+$/;
        return pattern.test(url) ? pattern.exec(url)[1] : null;
    };*/

    var parseUrl = function(url){
        //var pattern = /([^\/]+)\/([^\/]+)$/;
        var pattern = /\/([\w]*)(\/([\w]+))?($|\?|\#)/;
        var result = {};
        if(pattern.test(url)){
            var t = pattern.exec(url);
            result.type = t[1];
            if(t[3]){
                result.id = parseInt(t[3], 10);
            }
        }

        return result;
    };

    var isSameDomain = function(url){
        if(url.indexOf('://') < 0){
            return true;
        }
        if(url.indexOf(location.origin) === 0){
            return true;
        }

        return false;
    };

    exports.format = formatUrl;
    //exports.getType = getType;
    exports.parse = parseUrl;
    exports.isSameDomain = isSameDomain;
});