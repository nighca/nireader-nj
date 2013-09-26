define(function(require, exports, module){
    var request = require('./request');
    var formatUrl = require('./url').format;

    var resources = ['item', 'channel'];

    var getResource = function(url, callback){
    };

    var listUrl = {
        item: '/api/list/item',
        channel: '/api/list/channel'
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
            order: 'pubDate',
            descrease: true
        }
    };
    var listNumInPage = {
        item: 10,
        channel: 10
    };

    var listResource = function(type, opt, page, callback){
        if(!type || typeof type !== 'string'){
            return;
        }

        var numInPage = listNumInPage[type];

        params = {
            opt: opt,
            fields: listFields[type],
            sort: listSort[type],
            limit: {
                from: numInPage * (page - 1),
                num: numInPage
            }
        };

        var url = listUrl[type];
        request.get(params, url, callback);
    };

    var makeCertainList = function(type, opt, callback){
        return function(page){
            return listResource(type, opt, page, callback);
        }
    };

    exports.get = getResource;
    exports.list = listResource;
    exports.makeList = makeCertainList;
});