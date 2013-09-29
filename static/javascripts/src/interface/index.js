define(function(require, exports, module) {
    var api = {
        channel: {
            get: '/api/channel',
            list: '/api/list/channel',
            create: '/api/channel/create',
            save: '/api/channel/save'
        },
        item: {
            get: '/api/item',
            list: '/api/list/item'
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