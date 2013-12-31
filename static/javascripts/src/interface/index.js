define(function(require, exports, module) {
    var api = {
        channel: {
            get: '/api/channel',
            list: '/api/list/channel',
            search: '/api/search/channel',
            create: '/api/channel/create',
            save: '/api/channel/save',
            vote: '/api/channel/vote'
        },
        item: {
            get: '/api/item',
            list: '/api/list/item',
            search: '/api/search/item'
        },
        subscription: {
            get: '/api/subscription',
            list: '/api/list/subscription',
            add: '/api/subscription/add',
            remove: '/api/subscription/remove',
            read: '/api/subscription/read'
        },
        user: {
            get: '/api/user'
        },
        auth: {
            in: '/api/signin',
            out: '/api/signout'
        }
    };

    var page = {
        home: '/',
        entrance: '/welcome',
        channel: function(id){
            return '/channel/' + id;
        },
        item: function(id){
            return '/item/' + id;
        },
        myChannel: function(id){
            return '/my/channel/' + id;
        },
        myItem: function(id){
            return '/my/item/' + id;
        },
        recommendChannel: function(id){
            return '/recommend/channel/' + id;
        },
        recommendItem: function(id){
            return '/recommend/item/' + id;
        },
        auth: {
            qq: {
                auth: 'https://graph.qq.com/oauth2.0/authorize',
                callback: '/auth/qq',
                getId: 'https://graph.qq.com/oauth2.0/me'
            }
        }
    };

    module.exports = {
        api: api,
        page: page
    };
});