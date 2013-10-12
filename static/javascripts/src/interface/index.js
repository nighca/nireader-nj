define(function(require, exports, module) {
    var api = {
        channel: {
            get: '/api/channel',
            list: '/api/list/channel',
            search: '/api/search/channel',
            create: '/api/channel/create',
            save: '/api/channel/save'
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
            remove: '/api/subscription/remove'
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
        }
    };

    module.exports = {
        api: api,
        page: page
    };
});