define(function(require, exports, module){
    var request = require('./request');
    var cache = require('./cache');
    var formatUrl = require('./url').format;
    var apis = require('../interface/index').api;
    var config = require('../config').resource;

    var cacheLifetime = config.lifetime;

    var resources = ['item', 'channel'];

    var getUrl = {
        item: apis.item.get,
        channel: apis.channel.get,
        user: apis.user.get
    };
    var getSort = {
        item: {
            order: 'pubDate',
            descrease: true
        },
        channel: {
            order: 'id',
            descrease: false
        },
        user: {
            order: 'name',
            descrease: false
        }
    };

    var refreshResource = function(type, opt, callback, sort){
        if(!type || typeof type !== 'string'){
            return;
        }

        var cacheKey = {
            type: type,
            opt: opt,
            sort: sort
        };

        var params = {
            opt: opt,
            sort: sort || getSort[type]
        };

        var url = getUrl[type];
        request.get(params, url, function(err, resource){
            if(!err){
                cache.set(cacheKey, resource, cacheLifetime.resource)
            }
            callback && callback(err, resource);
        });
    };

    var getResource = function(type, opt, callback, sort, refresh){
        if(!type || typeof type !== 'string'){
            return;
        }

        var cachedResult, cacheKey = {
            cache: 'resource',
            type: type,
            opt: opt,
            sort: sort
        };
        if(!refresh && (cachedResult = cache.get(cacheKey))){
            callback && callback(null, cachedResult);
            return;
        }

        var params = {
            opt: opt,
            sort: sort || getSort[type]
        };

        var url = getUrl[type];
        request.get(params, url, function(err, resource){
            if(!err){
                cache.set(cacheKey, resource, cacheLifetime.resource)
            }
            callback && callback(err, resource);
        });
    };

    var makeGet = function(type, callback){
        return function(opt){
            return getResource(type, opt, callback);
        };
    };

    var listUrl = {
        item: apis.item.list,
        channel: apis.channel.list,
        subscription: apis.subscription.list
    };
    var listFields = {
        item: ['id', 'pubDate', 'title', 'source'],
        channel: ['id', 'pubDate', 'title'],
        subscription: [
            'channel.id', 
            'channel.pubDate', 
            'channel.title'
            //'channel.description',
            //'channel.generator'
        ]
    };
    var listSort = {
        item: {
            order: 'pubDate',
            descrease: true
        },
        channel: {
            order: 'id',
            descrease: false
        },
        subscription: {
            order: 'channel.id',
            descrease: false
        }
    };
    var listNumInPage = {
        item: 20,
        channel: 20,
        subscription: 20
    };

    var listResource = function(type, opt, page, callback, sort, fields, refresh){
        if(!type || typeof type !== 'string'){
            return;
        }

        var cachedResult, cacheKey = {
            cache: 'list',
            type: type,
            opt: opt,
            sort: sort
        };
        if(!refresh && (cachedResult = cache.get(cacheKey))){
            callback && callback(null, cachedResult);
            return;
        }

        var numInPage = listNumInPage[type];
        var limit;
        if(!page){
            limit = null;
        }else if(typeof page === 'object'){
            limit = page;
        }else{
            limit = 
                numInPage ? {
                    from: numInPage * (page - 1),
                    num: numInPage
                } : null;
        }

        var params = {
            opt: opt,
            fields: fields || listFields[type],
            sort: sort || listSort[type],
            limit: limit
        };

        var url = listUrl[type];
        request.get(params, url, function(err, list){
            if(!err){
                cache.set(cacheKey, list, cacheLifetime.list)
            }
            callback && callback(err, list);
        });
    };

    var makeCertainList = function(type, opt, callback, sort, fields, refresh){
        return function(page){
            return listResource(type, opt, page, callback, sort, fields, refresh);
        }
    };

    var searchUrl = {
        item: apis.item.search,
        channel: apis.channel.search,
        subscription: apis.subscription.search
    };
    var searchResource = function(type, keywords, page, callback, sort, fields){
        if(!type || typeof type !== 'string'){
            return;
        }

        var numInPage = listNumInPage[type];

        var limit;
        if(typeof page === 'object'){
            limit = page;
        }

        var params = {
            keywords: keywords,
            fields: fields || listFields[type],
            sort: sort || listSort[type],
            limit:
                limit ||
                (numInPage ? {
                    from: numInPage * (page - 1),
                    num: numInPage
                } : null)
        };

        var url = searchUrl[type];
        request.get(params, url, callback);
    };

    var makeCertainSearch = function(type, opt, callback, sort, fields){
        return function(page){
            return searchResource(type, opt, page, callback, sort, fields);
        }
    };

    exports.refresh = refreshResource;
    exports.get = getResource;
    exports.list = listResource;
    exports.search = searchResource;
    exports.makeList = makeCertainList;
    exports.makeSearch = makeCertainSearch;
});