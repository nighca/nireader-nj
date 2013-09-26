define(function(require, exports, module){
    var request = require('./request');
    var formatUrl = require('./url').format;
    var resourceIF = require('../interface/index').resource;

    var resources = ['item', 'channel'];

    var getUrl = {
        item: resourceIF.item.get,
        channel: resourceIF.channel.get,
    };
    var getSort = {
        item: {
            order: 'pubDate',
            descrease: true
        },
        channel: {
            order: 'id',
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
        item: resourceIF.item.list,
        channel: resourceIF.channel.list,
    };
    var listFields = {
        item: ['id', 'pubDate', 'title', 'source'],
        channel: ['id', 'pubDate', 'title']
    };
    var listSort = {
        item: {
            order: 'pubDate',
            descrease: true
        },
        channel: {
            order: 'id',
            descrease: false
        }
    };
    var listNumInPage = {
        item: 20,
        channel: 20
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