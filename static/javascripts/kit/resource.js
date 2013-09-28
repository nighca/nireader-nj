define(function(require, exports, module){
    var request = require('./request');
    var formatUrl = require('./url').format;
    var apis = require('../interface/index').api;

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

    var getResource = function(type, opt, callback, sort){
        if(!type || typeof type !== 'string'){
            return;
        }

        var params = {
            opt: opt,
            sort: sort || getSort[type]
        };

        var url = getUrl[type];
        request.get(params, url, callback);
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
            'channel.title', 
            'channel.description', 
            'channel.generator'
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

    var listResource = function(type, opt, page, callback, sort, fields){
        if(!type || typeof type !== 'string'){
            return;
        }

        var numInPage = listNumInPage[type];

        var limit;
        if(typeof page === 'object'){
            limit = page;
        }

        var params = {
            opt: opt,
            fields: fields || listFields[type],
            sort: sort || listSort[type],
            limit:
                limit ||
                (numInPage ? {
                    from: numInPage * (page - 1),
                    num: numInPage
                } : null)
        };

        var url = listUrl[type];
        request.get(params, url, callback);
    };

    var makeCertainList = function(type, opt, callback, sort, fields){
        return function(page){
            return listResource(type, opt, page, callback, sort, fields);
        }
    };

    exports.get = getResource;
    exports.list = listResource;
    exports.makeList = makeCertainList;
});